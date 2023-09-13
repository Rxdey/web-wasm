import { ref } from 'vue';

export const useDrag = (cb = (e: FileList | []) => { }) => {
    const uploadLoading = ref(false);

    const onDrop = (e: DragEvent) => {
        e.preventDefault();
        if (!e.target) return;
        (<HTMLElement>e.target).toggleAttribute('over', false);
        if (uploadLoading.value) return;
        cb(e.dataTransfer?.files || []);
    };
    const onDragleave = (e: DragEvent) => {
        e.preventDefault();
        if (!e.target) return;
        (<HTMLElement>e.target).toggleAttribute('over', false);

    };
    const onDragenter = (e: DragEvent) => {
        e.preventDefault();
        if (!e.target) return;
        (<HTMLElement>e.target).toggleAttribute('over', true);
    };
    const onFileChange = (e: Event) => {
        if (!e.target) return;
        cb((<HTMLInputElement>e.target).files || []);
    };

    return {
        uploadLoading,
        onDrop,
        onDragleave,
        onDragenter,
        onFileChange
    };
};