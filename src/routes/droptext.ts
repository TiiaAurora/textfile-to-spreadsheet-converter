type Action = (node: HTMLElement) => {
	destroy?: () => void
}

export const droptext: Action = (node) => {
    let over = false;

    function ondragover() {
        over = true;
        return false;
    }
    function ondragend() {
        over = false;
        return false;
    }
    function ondrop(e: DragEvent) {
        over = false;
		e.preventDefault();

	    const file = e.dataTransfer?.files[0];
        const reader = new FileReader();
		reader.onload = function (event) {
            const result = event.target?.result;
            const text = typeof result === "string" ? result : String(result);
            node.dispatchEvent(new CustomEvent('droppedtext', { detail: {text} }));
		};
        if (file) reader.readAsText(file);

		return false;
    }

    node.addEventListener('dragover', ondragover);
    node.addEventListener('dragend', ondragend);
    node.addEventListener('drop', ondrop);

    return {
        destroy: () => {
            node.removeEventListener('dragover', ondragover);
            node.removeEventListener('dragend', ondragend);
            node.removeEventListener('drop', ondrop);
        }
    };
}