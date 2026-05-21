<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TeamMember;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class TeamController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = TeamMember::query();

        if ($search = $request->input('search')) {
            $query->where('name', 'like', "%{$search}%")
                  ->orWhere('role', 'like', "%{$search}%")
                  ->orWhere('role_en', 'like', "%{$search}%");
        }

        if ($request->filled('is_active')) {
            $query->where('is_active', $request->input('is_active') === 'true');
        }

        $members = $query->orderBy('order')->orderBy('id')->paginate(10)->withQueryString();

        return Inertia::render('Admin/Team/Index', [
            'members' => $members,
            'filters' => $request->only(['search', 'is_active']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/Team/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'      => 'required|string|max:255',
            'role'      => 'required|string|max:255',
            'role_en'   => 'nullable|string|max:255',
            'image'     => 'required|image|max:2048|mimes:png,svg,jpg,jpeg,webp',
            'order'     => 'integer|min:0',
            'is_active' => 'boolean',
        ]);

        if ($request->hasFile('image')) {
            // Save inside category-specific folder 'team' inside 'public' storage disk
            $validated['image_path'] = $request->file('image')->store('team', 'public');
        }

        TeamMember::create($validated);

        return redirect()->route('admin.team-members.index')
            ->with('success', 'Ahli pasukan berjaya ditambah.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(TeamMember $teamMember)
    {
        return Inertia::render('Admin/Team/Edit', [
            'member' => $teamMember,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, TeamMember $teamMember)
    {
        $validated = $request->validate([
            'name'      => 'required|string|max:255',
            'role'      => 'required|string|max:255',
            'role_en'   => 'nullable|string|max:255',
            'image'     => 'nullable|image|max:2048|mimes:png,svg,jpg,jpeg,webp',
            'order'     => 'integer|min:0',
            'is_active' => 'boolean',
        ]);

        if ($request->hasFile('image')) {
            // Delete old image if it exists in storage
            if ($teamMember->image_path && Storage::disk('public')->exists($teamMember->image_path)) {
                Storage::disk('public')->delete($teamMember->image_path);
            }
            // Save inside category-specific folder 'team' inside 'public' storage disk
            $validated['image_path'] = $request->file('image')->store('team', 'public');
        }

        $teamMember->update($validated);

        return redirect()->route('admin.team-members.index')
            ->with('success', 'Maklumat ahli pasukan berjaya dikemaskini.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TeamMember $teamMember)
    {
        if ($teamMember->image_path && Storage::disk('public')->exists($teamMember->image_path)) {
            Storage::disk('public')->delete($teamMember->image_path);
        }
        
        $teamMember->delete();

        return redirect()->route('admin.team-members.index')
            ->with('success', 'Ahli pasukan berjaya dipadam.');
    }

    /**
     * Reorder team members via drag-and-drop (receives [{id, order}] array).
     */
    public function reorder(Request $request)
    {
        $request->validate([
            'items'         => 'required|array',
            'items.*.id'    => 'required|integer|exists:team_members,id',
            'items.*.order' => 'required|integer|min:0',
        ]);

        foreach ($request->input('items') as $item) {
            TeamMember::where('id', $item['id'])->update(['order' => $item['order']]);
        }

        return response()->json(['success' => true]);
    }

    /**
     * Toggle active status.
     */
    public function toggleActive(TeamMember $teamMember)
    {
        $teamMember->update(['is_active' => !$teamMember->is_active]);

        return response()->json([
            'success'   => true,
            'is_active' => $teamMember->is_active,
        ]);
    }
}
