import { hydrate, prerender as ssr } from "preact-iso";
import { useEffect, useState } from "react";

import "./style.css";

/**
 * @param {{ daySmiles: [string, string[]][] }} param0 Props
 * @returns A daily smile block.
 */
function DailySmiles({ daySmiles }) {
  return (
    <>
      {daySmiles.map(([day, smiles]) => (
        <div key={day}>
          <h4>{day}</h4>
          <div>
            {smiles.map((smile, index) => (
              <div>
                {index + 1}. {smile}
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

function getInitialTheme() {
  return document?.body?.getAttribute("data-theme") ?? "dracula";
}

function Header() {
  const [theme, setTheme] = useState(getInitialTheme());

  useEffect(() => {
    setTheme(getInitialTheme());
  }, []);

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div class="drawer">
      <input id="my-drawer" type="checkbox" class="drawer-toggle" />
      <div class="drawer-content">
        <header class="flex items-center justify-between">
          <a class="underline-offset-8" href="/">
            <span>Sorriso do Dia</span>
          </a>
          <label for="my-drawer" class="btn drawer-button btn-sm">
            Cor do site
          </label>
        </header>
      </div>
      <div class="drawer-side">
        <label
          for="my-drawer"
          aria-label="close sidebar"
          class="drawer-overlay"
        ></label>
        <div class="menu flex min-h-full w-2/5 flex-col gap-3 bg-base-200 p-4">
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
      </div>
    </div>
  );
}

export function App() {
  return (
    <article class="prose lg:prose-lg">
      <Header />
      <main>
        <h2>Todo dia um motivo novo pra sorrir! :D</h2>
        <DailySmiles
          daySmiles={[
            [
              "10/jun/24",
              [
                "Trabalhar com o gato deitado em você.",
                "Estudar um assunto que você gosta muito.",
              ],
            ],
            [
              "9/jun/24",
              [
                "Comer cookie quentinho. (Bonus: com café!)",
                "Estudar algo novo e interessante.",
              ],
            ],
            [
              "8/jun/24",
              [
                "Ver um filme no cinema comendo pipoca.",
                "Ver o sorriso da pessoa que você ama.",
                "Molhar um biscoito no café quente.",
                "Quando a comida é mehor do que você esperava.",
              ],
            ],
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
            ["2/jun/24", ["Teste"]],
          ]}
        />
      </main>
    </article>
  );
}

if (typeof window !== "undefined") {
  //@ts-expect-error - might be null: we know it isn't.
  hydrate(<App />, document.getElementById("app"));
}

//@ts-expect-error - implicit any: this is Preact api.
export async function prerender(data) {
  return await ssr(<App {...data} />);
}
