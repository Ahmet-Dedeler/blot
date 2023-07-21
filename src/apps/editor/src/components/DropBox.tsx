import { useRef, useEffect } from "preact/hooks";
import { getStore, useStore } from "../lib/state.ts";

export default function DropBox() {
    const elRef = useRef<HTMLDivElement>(null);

    console.log("render");

    useEffect(() => {
        // Make sure the ref is defined
                const state = getStore();
        console.log(state);
        
        if (elRef.current) {
            console.log("init ref");
            console.log(code);
            addDragDrop(document.body);
        }

    }, []);  // Empty dependency array means this effect runs once after initial render


    // const styles = `
    //     position: absolute;
    //     width: 100%;
    //     height: 100%;
    //     background: lightblue;
    //     opacity: .8;
    //     display: flex;
    //     align-items: center;
    //     justify-content: center;
    //     border: 3px dashed grey;
    //     left: 0px;
    //     top: 0px;
    // `

    return <>
        <style>{`
            .drop {
                position: absolute;
                width: 100%;
                height: 100%;
                background: lightblue;
                opacity: .8;
                align-items: center;
                justify-content: center;
                border: 3px dashed grey;
                left: 0px;
                top: 0px;
                display: flex;
            }

            .hidden {
                display: none;
            }
        `}</style>
        <div class="drop hidden" ref={elRef}>
            Drop an SVG or JS file.
        </div>
    </>

    function addDragDrop(el) {

        const droparea = elRef.current;

          window.addEventListener("drop", function(evt) {    
            let dt = evt.dataTransfer;
            let files = dt.files;

            droparea.classList.add("hidden");   

            const file = files[0];
            const fileName = file.name.split(".");
            const name = fileName[0];
            const extension = fileName[fileName.length - 1];

            var reader = new FileReader();
            reader.readAsText(file);

            reader.onloadend = event => {
                let text = reader.result;

                if (extension === "js") {
                  const end = code.cmState.doc.toString().length;
                  // console.log(code.cmState);
                  code.cmState.doc.dispatch({
                    changes: { from: 0, to: end, insert: text }
                  });
                } else if (extension === "svg") {
                  text = text.replaceAll("\n", "");

                  const newLines = 
                  `const t = new Turtle();\n`
                  + `t.fromSVG(String.raw\`${text}\`);\n`

                  state.codemirror.dispatch({
                    changes: { from: 0, insert: newLines }
                  });
                } else {
                  throw Error("Unknown extension:" + extension);
                }
            }

            pauseEvent(evt);
          });

          window.addEventListener("dragover", function(evt) {
            droparea.classList.remove("hidden");   
            pauseEvent(evt);
          });

          ["mouseout"].forEach(trigger => window.addEventListener(trigger, function(evt) {
              droparea.classList.add("hidden");   
          }));

        function pauseEvent(e) {
          if(e.stopPropagation) e.stopPropagation();
          if(e.preventDefault) e.preventDefault();
          e.cancelBubble=true;
          e.returnValue=false;
          return false;
        }
    }
}



