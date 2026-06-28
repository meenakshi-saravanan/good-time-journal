import { Editor } from "https://esm.sh/@tiptap/core@3.27.1";
import StarterKit from "https://esm.sh/@tiptap/starter-kit@3.27.1";
import Link from "https://esm.sh/@tiptap/extension-link@3.27.1";
import Underline from "https://esm.sh/@tiptap/extension-underline@3.27.1";
import Highlight from "https://esm.sh/@tiptap/extension-highlight@3.27.1";
import TextAlign from "https://esm.sh/@tiptap/extension-text-align@3.27.1";
import Placeholder from "https://esm.sh/@tiptap/extension-placeholder@3.27.1";

const editorElement =
  document.querySelector("#editor");

let autosaveTimer = null;
let lastSavedContent = "";

window.notesEditor = null;


if (editorElement) {
  window.notesEditor = new Editor({
    element: editorElement,
    editable: true,
    extensions: [
      StarterKit.configure({
        codeBlock: false
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true
      }),
      Placeholder.configure({
  placeholder: "Start writing..."
}),
      TextAlign.configure({
  types: [
    "heading",
    "paragraph"
  ]
  
}),
        Underline,
  Highlight
    ],

 content: "",

onCreate: ({ editor }) => {
  updateHeadingDropdown(editor);
  updateToolbar();
},

onSelectionUpdate: ({ editor }) => {
  updateHeadingDropdown(editor);
  updateToolbar();
},

onUpdate: ({ editor }) => {

    updateToolbar();
if (!window.appState?.selectedEntryId) {
    return;
}
const html = editor.getHTML();

const {
    title,
    preview
} = extractEntryMetadata(html);

console.log(typeof updateEntry);
const currentEntry =
    window.appState.entries.find(
        entry =>
            entry.id ===
            window.appState.selectedEntryId
    );
    clearTimeout(autosaveTimer);

autosaveTimer = setTimeout(async () => {
 if (html === lastSavedContent) {
        return;
    }
    try {

        await updateEntry(
            currentEntry.id,
            {
                title,
                preview,
                content: html
            }
        );

        console.log("✅ Entry saved");

    } catch (error) {

        console.error(error);

    }

}, 1000);

if (!currentEntry) {
    return;
}

currentEntry.title = title;
currentEntry.preview = preview;
currentEntry.content = html;

window.renderEntryList(
    window.getFilteredEntries()
);



},

editorProps: {
  attributes: {
    class: "tiptap-prose"
  }
}
  });

  document
    .querySelectorAll("[data-editor-command]")
    .forEach((button) => {
      button.addEventListener("click", () => {
        runEditorCommand(button.dataset.editorCommand);
      });
    });
}

function runEditorCommand(command) {
  if (!window.notesEditor) {
    return;
  }

  const chain =
    window.notesEditor.chain().focus();
lastSavedContent = window.notesEditor.getHTML();
  if (command === "heading") {
    chain.toggleHeading({ level: 2 }).run();
    return;
  }

  if (command === "bold") {
    chain.toggleBold().run();
    return;
  }

  if (command === "italic") {
    chain.toggleItalic().run();
    return;
  }

  if (command === "bulletList") {
    chain.toggleBulletList().run();
    return;
  }

  if (command === "orderedList") {
    chain.toggleOrderedList().run();
    return;
  }

  if (command === "blockquote") {
    chain.toggleBlockquote().run();
    return;
  }

  if (command === "horizontalRule") {
    chain.setHorizontalRule().run();
    return;
  }

  if (command === "link") {
    setEditorLink();
    return;
  }

  if (command === "unsetLink") {
    chain.unsetLink().run();
  }
}

document
  .getElementById(
    "linkButton"
  )
  ?.addEventListener(
    "click",
    () => {

      document
        .getElementById(
          "linkPopover"
        )
        .classList.remove(
          "d-none"
        );

      const existingLink =
        window.notesEditor
          .getAttributes(
            "link"
          ).href || "";

      document
        .getElementById(
          "linkInput"
        )
        .value =
          existingLink;

    }
  );
  document
  .getElementById(
    "applyLinkButton"
  )
  ?.addEventListener(
    "click",
    () => {

      const url =
        document
          .getElementById(
            "linkInput"
          )
          .value
          .trim();

      if (!url) {
        return;
      }

      window.notesEditor
        .chain()
        .focus()
        .extendMarkRange(
          "link"
        )
        .setLink({
          href: url
        })
        .run();
        document
  .getElementById(
    "linkPopover"
  )
  .classList.add(
    "d-none"
  );

    }
  );
  document
  .getElementById(
    "removeLinkButton"
  )
  ?.addEventListener(
    "click",
    () => {

      window.notesEditor
        .chain()
        .focus()
        .extendMarkRange(
          "link"
        )
        .unsetLink()
        .run();
        document
  .getElementById(
    "linkPopover"
  )
  .classList.add(
    "d-none"
  );

    }
  );
  document
  .getElementById(
    "openLinkButton"
  )
  ?.addEventListener(
    "click",
    () => {

      const url =
        document
          .getElementById(
            "linkInput"
          )
          .value;

      if (
        url
      ) {

        window.open(
          url,
          "_blank"
        );

      }

    }
  );

document
  .getElementById("undoButton")
  .addEventListener(
    "click",
    () => {
      window.notesEditor
        .chain()
        .focus()
        .undo()
        .run();
    }
  );

document
  .getElementById("redoButton")
  .addEventListener(
    "click",
    () => {
      window.notesEditor
        .chain()
        .focus()
        .redo()
        .run();
    }
  );

  function updateToolbar() {

  document
    .getElementById("undoButton")
    .disabled =
      !window.notesEditor.can()
        .chain()
        .undo()
        .run();

  document
    .getElementById("redoButton")
    .disabled =
      !window.notesEditor.can()
        .chain()
        .redo()
        .run();

        document
  .getElementById("undoButton")
  ?.classList.toggle(
    "disabled",
    !window.notesEditor.can()
      .chain()
      .undo()
      .run()
  );

document
  .getElementById("redoButton")
  ?.classList.toggle(
    "disabled",
    !window.notesEditor.can()
      .chain()
      .redo()
      .run()
  );
  const listDropdown =
  document.getElementById(
    "listDropdown"
  );
  document
  .getElementById("boldButton")
  ?.classList.toggle(
    "active",
    window.notesEditor.isActive("bold")
  );

document
  .getElementById("italicButton")
  ?.classList.toggle(
    "active",
    window.notesEditor.isActive("italic")
  );

document
  .getElementById("strikeButton")
  ?.classList.toggle(
    "active",
    window.notesEditor.isActive("strike")
  );

document
  .getElementById("underlineButton")
  ?.classList.toggle(
    "active",
    window.notesEditor.isActive("underline")
  );

document
  .getElementById("highlightButton")
  ?.classList.toggle(
    "active",
    window.notesEditor.isActive("highlight")
  );
    document
  .getElementById(
    "alignLeftButton"
  )
  ?.addEventListener(
    "click",
    () => {

      window.notesEditor
        .chain()
        .focus()
        .setTextAlign(
          "left"
        )
        .run();

    }
  );
  document
  .getElementById(
    "alignCenterButton"
  )
  ?.addEventListener(
    "click",
    () => {

      window.notesEditor
        .chain()
        .focus()
        .setTextAlign(
          "center"
        )
        .run();

    }
  );
  document
  .getElementById(
    "alignRightButton"
  )
  ?.addEventListener(
    "click",
    () => {

      window.notesEditor
        .chain()
        .focus()
        .setTextAlign(
          "right"
        )
        .run();

    }
  );
  document
  .getElementById(
    "alignJustifyButton"
  )
  ?.addEventListener(
    "click",
    () => {

      window.notesEditor
        .chain()
        .focus()
        .setTextAlign(
          "justify"
        )
        .run();

    }
  );

  document
  .getElementById(
    "alignLeftButton"
  )
  ?.classList.toggle(
    "active",
    window.notesEditor.isActive({
      textAlign: "left"
    })
  );
  document
  .getElementById(
    "alignCenterButton"
  )
  ?.classList.toggle(
    "active",
    window.notesEditor.isActive({
      textAlign: "center"
    })
  );
  document
  .getElementById(
    "alignRightButton"
  )
  ?.classList.toggle(
    "active",
    window.notesEditor.isActive({
      textAlign: "right"
    })
  );
  document
  .getElementById(
    "alignJustifyButton"
  )
  ?.classList.toggle(
    "active",
    window.notesEditor.isActive({
      textAlign: "justify"
    })
  );

if (listDropdown) {

  const isListActive =
    window.notesEditor.isActive(
      "bulletList"
    ) ||
    window.notesEditor.isActive(
      "orderedList"
    );

  listDropdown.classList.toggle(
    "active",
    isListActive
  );

}
}

function updateHeadingDropdown(editor) {

  const label =
    document.getElementById(
      "headingLabel"
    );

  if (!label || !editor) {
    return;
  }

  if (
    editor.isActive(
      "heading",
      { level: 1 }
    )
  ) {
    label.textContent = "H1";
  }

  else if (
    editor.isActive(
      "heading",
      { level: 2 }
    )
  ) {
    label.textContent = "H2";
  }

  else if (
    editor.isActive(
      "heading",
      { level: 3 }
    )
  ) {
    label.textContent = "H3";
  }

  else if (
    editor.isActive(
      "heading",
      { level: 4 }
    )
  ) {
    label.textContent = "H4";
  }

  else {
    label.textContent = "P";
  }

}

document
  .querySelectorAll("[data-heading]")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        const level =
          button.dataset.heading;

        if (level === "paragraph") {

          window.notesEditor
            .chain()
            .focus()
            .setParagraph()
            .run();

        } else {

          window.notesEditor
            .chain()
            .focus()
            .toggleHeading({
              level: Number(level)
            })
            .run();

        }

        updateHeadingDropdown(
  window.notesEditor
);

      }
    );

  });

  document
  .querySelectorAll("[data-list]")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        const listType =
          button.dataset.list;

        if (
          listType === "bullet"
        ) {

          window.notesEditor
            .chain()
            .focus()
            .toggleBulletList()
            .run();

        }

        if (
          listType === "ordered"
        ) {

          window.notesEditor
            .chain()
            .focus()
            .toggleOrderedList()
            .run();

        }

      }
    );

  });
  document
  .getElementById("boldButton")
  ?.addEventListener("click", () => {
    window.notesEditor
      .chain()
      .focus()
      .toggleBold()
      .run();
  });

document
  .getElementById("italicButton")
  ?.addEventListener("click", () => {
    window.notesEditor
      .chain()
      .focus()
      .toggleItalic()
      .run();
  });

document
  .getElementById("strikeButton")
  ?.addEventListener("click", () => {
    window.notesEditor
      .chain()
      .focus()
      .toggleStrike()
      .run();
  });

document
  .getElementById("underlineButton")
  ?.addEventListener("click", () => {
    window.notesEditor
      .chain()
      .focus()
      .toggleUnderline()
      .run();
  });

document
  .getElementById("highlightButton")
  ?.addEventListener("click", () => {
    window.notesEditor
      .chain()
      .focus()
      .toggleHighlight()
      .run();
  });
  document.addEventListener(
  "click",
  (event) => {

    const popover =
      document.getElementById(
        "linkPopover"
      );

    const linkButton =
      document.getElementById(
        "linkButton"
      );

    if (
      !popover ||
      popover.classList.contains(
        "d-none"
      )
    ) {
      return;
    }

    const clickedInsidePopover =
      popover.contains(
        event.target
      );

    const clickedLinkButton =
      linkButton.contains(
        event.target
      );

    if (
      !clickedInsidePopover &&
      !clickedLinkButton
    ) {

      popover.classList.add(
        "d-none"
      );

    }
  

  }

);

function extractEntryMetadata(html) {

    const temp =
        document.createElement("div");

    temp.innerHTML = html;

    const blocks =
        Array.from(temp.children);

    let title = "Untitled";

    let preview = "";

    if (blocks.length > 0) {

        title =
            blocks[0].textContent.trim() || "Untitled";

        preview =
            blocks
                .slice(1)
                .map(block => block.textContent.trim())
                .filter(text => text.length > 0)
                .join(" ");
                if (preview.length > 100) {

    preview =
        preview.substring(0, 100).trim() + "...";

}

    }

    return {
        title,
        preview
    };

}


  
