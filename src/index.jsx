import { hydrate, prerender as ssr } from "preact-iso";
import { useEffect, useState } from "preact/hooks";

import "./style.css";

function DailySmiles({ daySmiles }) {
  return daySmiles.map(([day, smiles]) => (
    <div>
      <h4>{day}</h4>
      <div>
        {smiles.map((smile, index) => (
          <div>
            {index + 1}. {smile}
          </div>
        ))}
      </div>
    </div>
  ));
}

function ThemeSelector() {
  const [theme, setTheme] = useState("dracula");

  useEffect(() => {
    setTheme(document.body.getAttribute("data-theme"));
  }, []);

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div class="flex gap-3">
      <div
        class={`btn btn-sm ${theme === "dracula" ? "btn-primary" : ""}`}
        onClick={() => setTheme("dracula")}
      >
        Dracula
      </div>
      <div
        class={`btn btn-sm ${theme === "dark" ? "btn-primary" : ""}`}
        onClick={() => setTheme("dark")}
      >
        Dark
      </div>
      <div
        class={`btn btn-sm ${theme === "light" ? "btn-primary" : ""}`}
        onClick={() => setTheme("light")}
      >
        Light
      </div>
    </div>
  );
}

export function App() {
  return (
    <article class="prose lg:prose-lg">
      <header class="flex justify-between items-center">
        <a class="underline-offset-8 border-b-2 border-b-black" href="/">
          <span>Sorriso do Dia</span>
        </a>
        <ThemeSelector />
      </header>
      <main>
        <h2>Todo dia um motivo novo pra sorrir! :D</h2>
        <DailySmiles
          daySmiles={[
            [
              "7/jun/24",
              [
                "Dormir bem, mesmo quando são poucas horas.",
                "Conversar sobre besteiras.",
              ],
            ],
            [
              "6/jun/24",
              [
                "Ver uma série divertida.",
                "Piadocas bem feitas e no momento certo.",
                "A água quente tocando no corpo ao ligar o chuveiro em um dia frio.",
                "As versões brasileiras de qualquer música internacional.",
              ],
            ],
            [
              "5/jun/24",
              [
                "Cheiro de café quentinho.",
                "Miado de gato bebê.",
                "Ronronado de gatinhos quando você faz carinho.",
              ],
            ],
            [
              "4/jun/24",
              [
                "O cheiro de feijão recém cozido.",
                "O céu roxo e rosa do por do sol de maio.",
                "Conversar com amigos que você não vê há muito tempo.",
              ],
            ],
            [
              "3/jun/24",
              [
                "O cheirinho do pão de sal (francês) quando você rasga ele no meio, especialmente quentinho.",
                "Sopa quente no frio.",
              ],
            ],
          ]}
        />
      </main>
    </article>
  );
}

if (typeof window !== "undefined") {
  hydrate(<App />, document.getElementById("app"));
}

export async function prerender(data) {
  return await ssr(<App {...data} />);
}
