import MarkdownIt from "markdown-it";
// import style manually
import dynamic from "next/dynamic";
import { CLIENT_AXIOS } from "../client/clientAxios";

const MdEditor = dynamic(() => import("react-markdown-editor-lite"), {
  ssr: false,
});

// Register plugins if required
// MdEditor.use(YOUR_PLUGINS_HERE);

// Initialize a markdown parser
const mdParser = new MarkdownIt(/* Markdown-it options */);

// Finish!
// function handleEditorChange({ html, text }) {
//   console.log("handleEditorChange", text);
// }

export default ({ onChange, value, plugin, height, name, defaultValue }) => {
  return (
    <MdEditor
    defaultValue={defaultValue}
      value={value}
      name={name}
      plugins={
        plugin ?? [
          "header",
          "font-bold",
          "font-italic",
          "font-underline",
          "font-strikethrough",
          "list-unordered",
          "list-ordered",
          "block-quote",
          "block-wrap",
          "block-code-inline",
          "block-code-block",
          "table",
          "image",
          "link",
          "clear",
          "logger",
          "mode-toggle",
          "full-screen",
        ]
      }
      placeholder="Tekan icon keyboard untuk memperbesar layar"
      style={{ height: height ?? "500px" }}
      renderHTML={(text) => mdParser.render(text)}
      onChange={onChange}
      onImageUpload={async (file) => {
        const data = new FormData();
        data.append("file", file);
        const res = await CLIENT_AXIOS.post("/uploads", data);

        return res.data;
      }}
    />
  );
};
