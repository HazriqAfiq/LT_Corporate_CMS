<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PromoOrder;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class PromoOrderController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:access_settings'),
        ];
    }

    /**
     * Display a listing of the promo orders.
     */
    public function index(Request $request)
    {
        $query = PromoOrder::query();

        // Search filter
        if ($search = $request->input('search')) {
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhere('company', 'like', "%{$search}%")
                  ->orWhere('payment_id', 'like', "%{$search}%");
            });
        }

        // Status filter
        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        $orders = $query->orderBy('created_at', 'desc')->paginate(15)->withQueryString();

        // Stats calculation
        $paidCount = PromoOrder::where('status', 'paid')->count();
        $pendingCount = PromoOrder::where('status', 'pending')->count();
        $failedCount = PromoOrder::where('status', 'failed')->count();
        $totalRevenue = PromoOrder::where('status', 'paid')->sum('amount');
        $slotsRemaining = max(0, 20 - $paidCount);

        return Inertia::render('Admin/PromoOrders/Index', [
            'orders' => $orders,
            'filters' => $request->only(['search', 'status']),
            'stats' => [
                'paidCount' => $paidCount,
                'pendingCount' => $pendingCount,
                'failedCount' => $failedCount,
                'totalRevenue' => (float)$totalRevenue,
                'slotsRemaining' => $slotsRemaining,
            ]
        ]);
    }

    /**
     * Mark the pending order as paid.
     */
    public function markPaid(int $id)
    {
        $order = PromoOrder::findOrFail($id);

        if ($order->status !== 'paid') {
            $order->update([
                'status' => 'paid',
                'payment_id' => 'manual_' . auth()->id() . '_' . time()
            ]);

            ActivityLogger::log('update', "Tempahan promosi ditukar kepada BERJAYA (Manual) oleh Admin untuk: \"{$order->name}\"", $order);

            return back()->with('success', 'Tempahan berjaya dikemaskini kepada Telah Bayar.');
        }

        return back()->with('error', 'Tempahan ini telah pun dibayar.');
    }

    /**
     * Remove the specified order from database.
     */
    public function destroy(int $id)
    {
        $order = PromoOrder::findOrFail($id);
        $orderName = $order->name;
        $order->delete();

        ActivityLogger::log('delete', "Tempahan promosi untuk: \"{$orderName}\" telah dipadam oleh Admin");

        return back()->with('success', 'Tempahan berjaya dipadam.');
    }
}
