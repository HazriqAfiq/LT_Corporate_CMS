<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactInquiry;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class ContactInquiryController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:edit_inquiries|delete_inquiries', only: ['index']),
            new Middleware('permission:edit_inquiries', only: ['edit', 'markAsRead', 'update']),
            new Middleware('permission:delete_inquiries', only: ['destroy']),
        ];
    }

    public function index(Request $request)
    {
        $query = ContactInquiry::query()->with('reader');

        if ($search = $request->input('search')) {
            $query->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('subject', 'like', "%{$search}%");
        }

        if ($request->filled('is_read')) {
            $value = $request->input('is_read');
            if ($value === 'replied') {
                $query->whereNotNull('replied_at');
            } else {
                $query->where('is_read', $value === 'true');
            }
        }

        $inquiries = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('Admin/Inquiries/Index', [
            'inquiries' => $inquiries,
            'filters' => $request->only(['search', 'is_read']),
        ]);
    }

    public function edit(ContactInquiry $inquiry)
    {
        if (!$inquiry->is_read) {
            $inquiry->markAsRead();
            $inquiry->load('reader');
        }

        return Inertia::render('Admin/Inquiries/Edit', [
            'inquiry' => $inquiry,
        ]);
    }

    public function update(Request $request, ContactInquiry $inquiry)
    {
        $validated = $request->validate([
            'is_read' => 'boolean',
            'replied_at' => 'nullable|date',
            'admin_notes' => 'nullable|string',
        ]);

        $inquiry->update($validated);

        ActivityLogger::logUpdate('Pertanyaan (Contact)', $inquiry->name, $inquiry);

        return redirect()->route('admin.inquiries.index')->with('success', 'Pertanyaan dikemaskini.');
    }

    public function destroy(ContactInquiry $inquiry)
    {
        $inquiryName = $inquiry->name;
        $inquiry->delete();

        ActivityLogger::logDelete('Pertanyaan (Contact)', $inquiryName);
        return redirect()->route('admin.inquiries.index')->with('success', 'Pertanyaan dipadam.');
    }

    public function markAsRead(ContactInquiry $inquiry)
    {
        $inquiry->markAsRead();

        ActivityLogger::logUpdate('Pertanyaan (Contact)', $inquiry->name, $inquiry);
        return back()->with('success', 'Ditandai sebagai telah dibaca.');
    }
}
