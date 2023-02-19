import { MantineProvider } from "@mantine/core";
import { RichTextEditor } from "@mantine/tiptap";
import type { AnyExtension } from "@tiptap/core";
import TipTapHightlight from "@tiptap/extension-highlight";
import MantineTiptapLink from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import SubScript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";
import { createProductPageStore } from "../../logic/create-products/createProductsPageStore";

export const ProductDescriptionEditor = () => {
  const description = createProductPageStore(
    (state) => state.product.description
  );
  const editor = useEditor({
    extensions: [
      StarterKit as AnyExtension,
      Underline,
      Placeholder.configure({
        placeholder: "Item description",
      }),
      MantineTiptapLink,
      Superscript,
      SubScript,
      TipTapHightlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: description,
    editorProps: { attributes: { class: "min-h-[300px]" } },
    onUpdate: ({ editor, transaction }) => {
      createProductPageStore.setState((state) => {
        state.product.description = editor?.getHTML() ?? "";
      });
    },
  });

  useEffect(() => {
    editor?.commands.setContent(description);
  }, [description]);

  return (
    <MantineProvider theme={{ colorScheme: "dark" }}>
      <RichTextEditor editor={editor}>
        <RichTextEditor.Toolbar sticky stickyOffset={60}>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Bold />
            <RichTextEditor.Italic />
            <RichTextEditor.Underline />
            <RichTextEditor.Strikethrough />
            <RichTextEditor.ClearFormatting />
            <RichTextEditor.Highlight />
            <RichTextEditor.Code />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.H1 />
            <RichTextEditor.H2 />
            <RichTextEditor.H3 />
            <RichTextEditor.H4 />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Blockquote />
            <RichTextEditor.Hr />
            <RichTextEditor.BulletList />
            <RichTextEditor.OrderedList />
            <RichTextEditor.Subscript />
            <RichTextEditor.Superscript />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Link />
            <RichTextEditor.Unlink />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.AlignLeft />
            <RichTextEditor.AlignCenter />
            <RichTextEditor.AlignJustify />
            <RichTextEditor.AlignRight />
          </RichTextEditor.ControlsGroup>
        </RichTextEditor.Toolbar>

        <RichTextEditor.Content />
      </RichTextEditor>
    </MantineProvider>
  );
};
