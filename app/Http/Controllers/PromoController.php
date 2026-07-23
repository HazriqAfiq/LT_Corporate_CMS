<?php

namespace App\Http\Controllers;

use App\Models\PromoOrder;
use App\Models\Setting;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PromoController extends Controller
{
    private function sharedData(): array
    {
        $settings = [];
        if (\Illuminate\Support\Facades\Schema::hasTable('settings')) {
            $settingsData = Setting::with('media')->get();
            foreach ($settingsData as $setting) {
                if ($setting->type === 'image') {
                    if ($setting->media) {
                        $settings[$setting->key] = $setting->media->url;
                    } else {
                        $value = $setting->value;
                        if ($value) {
                            $settings[$setting->key] = (str_starts_with($value, 'http') || str_starts_with($value, '/storage') || str_starts_with($value, 'storage'))
                                ? (str_starts_with($value, '/storage') || str_starts_with($value, 'http') ? $value : '/storage/' . $value)
                                : '/storage/' . $value;
                        } else {
                            $settings[$setting->key] = null;
                        }
                    }
                } else {
                    $settings[$setting->key] = $setting->value;
                    $settings[$setting->key . '_en'] = $setting->value_en;
                }
            }
        }

        return [
            'settings' => $settings,
        ];
    }

    /**
     * Display the promo landing page.
     */
    public function index()
    {
        $slotsCount = PromoOrder::getPaidSlotsCount();
        $remainingSlots = max(0, 20 - $slotsCount);
        $price = $slotsCount >= 20 ? 2500.00 : 1000.00;

        return Inertia::render('Public/Promo', array_merge($this->sharedData(), [
            'slotsCount' => $slotsCount,
            'remainingSlots' => $remainingSlots,
            'currentPrice' => $price,
        ]));
    }

    /**
     * Display the promo booking form (Tempah Sekarang page).
     */
    public function bookForm()
    {
        $slotsCount = PromoOrder::getPaidSlotsCount();
        $remainingSlots = max(0, 20 - $slotsCount);
        $price = $slotsCount >= 20 ? 2500.00 : 1000.00;

        $stripeConfigured = !empty(config('services.stripe.key')) && !empty(config('services.stripe.secret'));
        $chipConfigured = !empty(config('services.chip.api_key')) && !empty(config('services.chip.brand_id'));

        return Inertia::render('Public/PromoBook', array_merge($this->sharedData(), [
            'slotsCount' => $slotsCount,
            'remainingSlots' => $remainingSlots,
            'currentPrice' => $price,
            'stripeConfigured' => $stripeConfigured,
            'stripeKey' => config('services.stripe.key'),
            'chipConfigured' => $chipConfigured,
        ]));
    }

    /**
     * Handle the promo booking submission.
     */
    public function book(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:25',
            'company' => 'nullable|string|max:255',
            'notes' => 'nullable|string|max:1000',
            'payment_gateway' => 'required|string|in:stripe,mock,chip',
        ]);

        // Calculate amount based on dynamic slots
        $slotsCount = PromoOrder::getPaidSlotsCount();
        $price = $slotsCount >= 20 ? 2500.00 : 1000.00;

        $order = PromoOrder::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'company' => $validated['company'] ?? null,
            'notes' => $validated['notes'] ?? null,
            'amount' => $price,
            'payment_gateway' => 'chip',
            'status' => 'pending',
        ]);

        ActivityLogger::log('create', "Tempahan promosi baharu dibuat oleh: \"{$order->name}\" (Pakej RM{$order->amount})", $order);

        // CHIP gateway integration
        $apiKey = config('services.chip.api_key');
        $brandId = config('services.chip.brand_id');

        if (!$apiKey || !$brandId) {
            $order->delete();
            return back()->withErrors(['payment_gateway' => 'CHIP gateway is not configured.']);
        }

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $apiKey,
        ])->post('https://gate.chip-in.asia/api/v1/purchases/', [
            'brand_id' => $brandId,
            'client' => [
                'email' => $order->email,
                'full_name' => $order->name,
                'phone' => $order->phone,
            ],
            'purchase' => [
                'currency' => 'MYR',
                'products' => [
                    [
                        'name' => 'Slot Promosi Khas Landing Page Profesional',
                        'price' => (int) ($order->amount * 100), // in cents
                    ]
                ]
            ],
            'success_redirect' => route('promo.success', ['uuid' => $order->uuid]),
            'failure_redirect' => route('promo.cancel', ['uuid' => $order->uuid]),
        ]);

        if ($response->failed()) {
            $errorData = $response->json();
            $errorMsg = $errorData['message'] ?? 'Ralat menyambung ke CHIP. Sila cuba lagi.';
            $order->delete();
            return back()->withErrors(['payment_gateway' => 'CHIP Error: ' . $errorMsg]);
        }

        $purchase = $response->json();
        $order->update(['payment_id' => $purchase['id']]);

        // Redirect user to CHIP checkout page
        return Inertia::location($purchase['checkout_url']);
    }

    /**
     * Show mock checkout simulation page.
     */
    public function mockCheckout(string $uuid)
    {
        $order = PromoOrder::where('uuid', $uuid)->where('status', 'pending')->firstOrFail();
        return Inertia::render('Public/MockCheckout', array_merge($this->sharedData(), [
            'order' => $order,
        ]));
    }

    /**
     * Process mock payment success.
     */
    public function mockPay(string $uuid)
    {
        $order = PromoOrder::where('uuid', $uuid)->where('status', 'pending')->firstOrFail();
        $order->update([
            'status' => 'paid',
            'payment_id' => 'mock_tx_' . Str::random(12),
        ]);

        ActivityLogger::log('update', "Pembayaran promosi berjaya diterima (Simulasi) untuk tempahan: \"{$order->name}\" (RM{$order->amount})", $order);

        return redirect()->route('promo.success', ['uuid' => $order->uuid]);
    }

    /**
     * Process mock payment cancel.
     */
    public function mockCancel(string $uuid)
    {
        $order = PromoOrder::where('uuid', $uuid)->where('status', 'pending')->firstOrFail();
        $order->update([
            'status' => 'failed',
        ]);

        ActivityLogger::log('update', "Pembayaran promosi gagal/dibatalkan (Simulasi) untuk tempahan: \"{$order->name}\"", $order);

        return redirect()->route('promo.cancel', ['uuid' => $order->uuid]);
    }

    /**
     * Payment Success redirect page.
     */
    public function success(Request $request, string $uuid = null)
    {
        $uuid = $uuid ?: $request->query('uuid');
        if (!$uuid) {
            abort(404);
        }

        $order = PromoOrder::where('uuid', $uuid)->firstOrFail();

        // Check if we need to retrieve Stripe status
        if ($order->status === 'pending' && $request->filled('session_id') && $order->payment_gateway === 'stripe') {
            $sessionId = $request->query('session_id');
            $secret = config('services.stripe.secret');
            if ($secret) {
                $response = Http::withHeaders([
                    'Authorization' => 'Bearer ' . $secret,
                ])->get("https://api.stripe.com/v1/checkout/sessions/{$sessionId}");

                if ($response->successful()) {
                    $session = $response->json();
                    if ($session['payment_status'] === 'paid') {
                        $order->update(['status' => 'paid']);
                        ActivityLogger::log('update', "Pembayaran promosi berjaya diterima via Stripe untuk tempahan: \"{$order->name}\" (RM{$order->amount})", $order);
                    }
                }
            }
        }

        // Check if we need to retrieve CHIP status
        if ($order->status === 'pending' && $order->payment_gateway === 'chip') {
            $apiKey = config('services.chip.api_key');
            if ($apiKey && $order->payment_id) {
                $response = Http::withHeaders([
                    'Authorization' => 'Bearer ' . $apiKey,
                ])->get("https://gate.chip-in.asia/api/v1/purchases/{$order->payment_id}/");

                if ($response->successful()) {
                    $purchase = $response->json();
                    $status = $purchase['status'] ?? '';
                    if ($status === 'paid' || $status === 'executed') {
                        $order->update(['status' => 'paid']);
                        ActivityLogger::log('update', "Pembayaran promosi berjaya diterima via CHIP untuk tempahan: \"{$order->name}\" (RM{$order->amount})", $order);
                    }
                }
            }
        }

        return Inertia::render('Public/PromoSuccess', array_merge($this->sharedData(), [
            'order' => $order,
        ]));
    }

    /**
     * Payment Cancel redirect page.
     */
    public function cancel(Request $request, string $uuid = null)
    {
        $uuid = $uuid ?: $request->query('uuid');
        if (!$uuid) {
            abort(404);
        }

        $order = PromoOrder::where('uuid', $uuid)->firstOrFail();

        if ($order->status === 'pending') {
            $order->update(['status' => 'failed']);
        }

        return Inertia::render('Public/PromoCancel', array_merge($this->sharedData(), [
            'order' => $order,
        ]));
    }

    /**
     * Webhook listener for Stripe asynchronous events.
     */
    public function stripeWebhook(Request $request)
    {
        $secret = config('services.stripe.secret');
        if (!$secret) {
            return response()->json(['error' => 'Not configured'], 500);
        }

        $payload = $request->getContent();
        $event = json_decode($payload, true);

        if (!$event) {
            return response()->json(['error' => 'Invalid payload'], 400);
        }

        if ($event['type'] === 'checkout.session.completed') {
            $session = $event['data']['object'];
            $uuid = $session['metadata']['order_uuid'] ?? null;

            if ($uuid) {
                $order = PromoOrder::where('uuid', $uuid)->where('status', 'pending')->first();
                if ($order) {
                    $order->update(['status' => 'paid']);
                    ActivityLogger::log('update', "Pembayaran promosi berjaya diterima via Webhook Stripe untuk tempahan: \"{$order->name}\" (RM{$order->amount})", $order);
                }
            }
        }

        return response()->json(['success' => true]);
    }

    /**
     * Retry payment for an existing pending/failed order.
     * Creates a new order record with the same details to keep the old failed record intact.
     */
    public function retryPayment(string $uuid)
    {
        $oldOrder = PromoOrder::where('uuid', $uuid)->firstOrFail();

        // If the old order is already paid, just redirect to success
        if ($oldOrder->status === 'paid') {
            return redirect()->route('promo.success', ['uuid' => $oldOrder->uuid]);
        }

        // Create a new order record duplicating the client's information
        $order = PromoOrder::create([
            'name' => $oldOrder->name,
            'email' => $oldOrder->email,
            'phone' => $oldOrder->phone,
            'company' => $oldOrder->company,
            'amount' => $oldOrder->amount,
            'payment_gateway' => $oldOrder->payment_gateway,
            'status' => 'pending',
            'notes' => $oldOrder->notes,
        ]);

        ActivityLogger::log('create', "Cuba semula tempahan promosi baharu dibuat oleh: \"{$order->name}\" (Pakej RM{$order->amount})", $order);

        // We can check the payment gateway and redirect/initiate payment
        if ($order->payment_gateway === 'mock') {
            return redirect()->route('promo.checkout.mock', ['uuid' => $order->uuid]);
        }

        if ($order->payment_gateway === 'stripe') {
            $secret = config('services.stripe.secret');
            if (!$secret) {
                $order->delete();
                return back()->withErrors(['payment_gateway' => 'Stripe gateway is not configured.']);
            }

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $secret,
            ])->post('https://api.stripe.com/v1/checkout/sessions', [
                'payment_method_types' => ['card'],
                'line_items' => [[
                    'price_data' => [
                        'currency' => 'myr',
                        'product_data' => [
                            'name' => 'Slot Promosi Khas Landing Page Profesional',
                        ],
                        'unit_amount' => (int) ($order->amount * 100),
                    ],
                    'quantity' => 1,
                ]],
                'mode' => 'payment',
                'success_url' => route('promo.success', ['uuid' => $order->uuid]) . '?session_id={CHECKOUT_SESSION_ID}',
                'cancel_url' => route('promo.cancel', ['uuid' => $order->uuid]),
                'metadata' => [
                    'order_uuid' => $order->uuid,
                ],
            ]);

            if ($response->failed()) {
                $order->delete();
                return redirect()->route('promo.cancel', ['uuid' => $oldOrder->uuid])
                    ->withErrors(['payment_gateway' => 'Stripe Error: ' . ($response->json()['error']['message'] ?? 'Unable to create session')]);
            }

            $session = $response->json();
            $order->update(['payment_id' => $session['id']]);

            return Inertia::location($session['url']);
        }

        if ($order->payment_gateway === 'chip') {
            $apiKey = config('services.chip.api_key');
            $brandId = config('services.chip.brand_id');

            if (!$apiKey || !$brandId) {
                $order->delete();
                return redirect()->route('promo.cancel', ['uuid' => $oldOrder->uuid])
                    ->withErrors(['payment_gateway' => 'CHIP gateway is not configured.']);
            }

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $apiKey,
            ])->post('https://gate.chip-in.asia/api/v1/purchases/', [
                'brand_id' => $brandId,
                'client' => [
                    'email' => $order->email,
                    'full_name' => $order->name,
                    'phone' => $order->phone,
                ],
                'purchase' => [
                    'currency' => 'MYR',
                    'products' => [
                        [
                            'name' => 'Slot Promosi Khas Landing Page Profesional',
                            'price' => (int) ($order->amount * 100), // in cents
                        ]
                    ]
                ],
                'success_redirect' => route('promo.success', ['uuid' => $order->uuid]),
                'failure_redirect' => route('promo.cancel', ['uuid' => $order->uuid]),
            ]);

            if ($response->failed()) {
                $order->delete();
                $errorData = $response->json();
                $errorMsg = $errorData['message'] ?? 'Ralat menyambung ke CHIP. Sila cuba lagi.';
                return redirect()->route('promo.cancel', ['uuid' => $oldOrder->uuid])
                    ->withErrors(['payment_gateway' => 'CHIP Error: ' . $errorMsg]);
            }

            $purchase = $response->json();
            $order->update(['payment_id' => $purchase['id']]);

            return Inertia::location($purchase['checkout_url']);
        }

        return redirect()->route('promo.index');
    }
}
