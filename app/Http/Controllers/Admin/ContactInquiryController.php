<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactInquiry;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContactInquiryController extends Controller
{
    public function index(Request $request)
    {
        $query = ContactInquiry::query();

        if ($search = $request->input('search')) {
            $query->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('subject', 'like', "%{$search}%");
        }

        if ($request->filled('is_read')) {
            $query->where('is_read', $request->input('is_read') === 'true');
        }

        $inquiries = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('Admin/Inquiries/Index', [
            'inquiries' => $inquiries,
            'filters' => $request->only(['search', 'is_read']),
        ]);
    }

    public function edit(ContactInquiry $inquiry)
    {
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
