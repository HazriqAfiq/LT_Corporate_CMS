<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Slider;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class SliderController extends Controller
{
    public function index(Request $request)
    {
        $query = Slider::query()->with('media');

        if ($search = $request->input('search')) {
            $query->where('title', 'like', "%{$search}%")
                  ->orWhere('subtitle', 'like', "%{$search}%");
        }

        if ($request->filled('is_active')) {
            $query->where('is_active', $request->input('is_active') === 'true');
        }

        $sliders = $query->orderBy('order')->latest()->paginate(10)->withQueryString();

        return Inertia::render('Admin/Sliders/Index', [
            'sliders' => $sliders,
            'filters' => $request->only(['search', 'is_active']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Sliders/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'          => 'required|string|max:255',
            'title_en'       => 'nullable|string|max:255',
            'subtitle'       => 'nullable|string|max:255',
            'subtitle_en'    => 'nullable|string|max:255',
            'description'    => 'nullable|string|max:500',
            'description_en' => 'nullable|string|max:500',
            'media_id'       => 'required|exists:media,id',
            'button_text'    => 'nullable|string|max:100',
            'button_text_en' => 'nullable|string|max:100',
            'button_url'     => 'nullable|url|max:255',
            'order'          => 'integer',
            'is_active'      => 'boolean',
        ]);



        $slider = Slider::create($validated);

        ActivityLogger::logCreate('Slider', $slider->title, $slider);

        return redirect()->route('admin.sliders.index')
            ->with('success', 'Slider berjaya ditambah.');
    }

    public function edit(Slider $slider)
    {
        $slider->load(['media']);
        return Inertia::render('Admin/Sliders/Edit', [
            'slider' => $slider->append(['media']),
        ]);
    }

    public function update(Request $request, Slider $slider)
    {
        $validated = $request->validate([
            'title'          => 'required|string|max:255',
            'title_en'       => 'nullable|string|max:255',
            'subtitle'       => 'nullable|string|max:255',
            'subtitle_en'    => 'nullable|string|max:255',
            'description'    => 'nullable|string|max:500',
            'description_en' => 'nullable|string|max:500',
            'media_id'       => 'nullable|exists:media,id',
            'button_text'    => 'nullable|string|max:100',
            'button_text_en' => 'nullable|string|max:100',
            'button_url'     => 'nullable|url|max:255',
            'order'          => 'integer',
            'is_active'      => 'boolean',
        ]);



        $slider->update($validated);

        ActivityLogger::logUpdate('Slider', $slider->title, $slider);

        return back()
            ->with('success', 'Slider berjaya dikemaskini.');
    }

    public function destroy(Slider $slider)
    {

        $title = $slider->title;
        $slider->delete();

        ActivityLogger::logDelete('Slider', $title);

        return redirect()->route('admin.sliders.index')
            ->with('success', 'Slider berjaya dipadam.');
    }

    /**
     * Reorder sliders via drag-and-drop (receives [{id, order}] array).
     */
    public function reorder(Request $request)
    {
        $request->validate([
            'items'         => 'required|array',
            'items.*.id'    => 'required|integer|exists:sliders,id',
            'items.*.order' => 'required|integer|min:0',
        ]);

        foreach ($request->input('items') as $item) {
            Slider::where('id', $item['id'])->update(['order' => $item['order']]);
        }

        return response()->json(['success' => true]);
    }

    /**
     * Toggle a slider's active status.
     */
    public function toggleActive(Slider $slider)
    {
        $slider->update(['is_active' => !$slider->is_active]);

        return response()->json([
            'success'   => true,
            'is_active' => $slider->is_active,
        ]);
    }
}
