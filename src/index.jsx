import {
  ErrorBoundary,
  LocationProvider,
  Route,
  Router,
  hydrate,
  lazy,
  prerender as ssr,
} from "preact-iso";
import { useEffect, useState } from "preact/hooks";

import data from "./data.txt?raw";
import "./style.css";

const nonEmptyLines = data
  .trim()
  .split("\n")
  .filter((line) => line !== "")
  .reduce(
    /**
     *
     * @param {Map<string, string|number|string[]>} acc
     * @param {string} curr
     * @returns
     */
    (acc, curr) => {
      const key = acc.get("next");

      // Initialization.
      if (key === 0 || !curr.startsWith("- ")) {
        acc.set("next", curr);
        acc.set(curr, []);
        return acc;
      }

      // At this point, we know that the key is a string and
      // that it will bring an array for us.

      /**
       * @type {string[]}
       */
      //@ts-ignore
      const currArray = acc.get(key);
      currArray.push(curr);
      //@ts-ignore
      acc.set(key, currArray);

      return acc;
    },
    new Map([["next", 0]]),
  );

/**
 * @returns A daily smile block.
 */
function DailySmiles() {
  return (
    <>
      {Array.from(nonEmptyLines.entries())
        .filter((x) => x[0] !== "next")
        .map(([day, smiles]) => (
          <div key={day}>
            <div class="flex flex-row items-baseline gap-3">
              <h4 class="text-primary">{day.replace(/ .*$/, "")}</h4>
              <div class="text-xs font-light italic text-secondary">
                {day.replace(/^[^ ]+ /, "")}
              </div>
            </div>
            <ol class="leading-5">
              {/* @ts-expect-error - smiles can only be an array here. */}
              {smiles.map((smile) => (
                <li>{smile.replace("- ", "")}</li>
              ))}
            </ol>
          </div>
        ))}
    </>
  );
}

function Header() {
  const [theme, setTheme] = useState("dracula");

  useEffect(() => {
    setTheme(document?.body?.getAttribute("data-theme") ?? "dracula");
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

function Home() {
  return (
    <article class="prose lg:prose-lg">
      <Header />
      <main>
        <h2>Todo dia um motivo novo pra sorrir! :D</h2>
        <h4>
          <i>
            A ideia desse site é manter uma lista das coisas boas do dia a dia,
            pra nos ajudar a lembrar.
          </i>
        </h4>
        <DailySmiles />
      </main>
    </article>
  );
}

function NotFound() {
  return (
    <div class="flex flex-col gap-3 items-center">
      <div>Nada por aqui. Mas tudo bem, é só voltar!</div>
      <a class="btn btn-sm uppercase btn-primary" href="/">
        Voltar
      </a>
    </div>
  );
}

/**
 * @param {any} props
 */
function About(props) {
  return (
    <div class="flex flex-row items-center">
      <span>Criado por Marcelo Almeida (</span>
      <a
        class="text-primary underline decoration-2 underline-offset-4"
        href="https://github.com/marcelocra"
        target="_blank"
      >
        github
      </a>
      <span>) com muito 💜️ e ☕️.</span>
    </div>
  );
}

export function App() {
  return (
    <LocationProvider>
      <ErrorBoundary>
        <Router>
          <Home path="/" />

          {/* Alternative dedicated route component for better TS support */}
          <Route path="/about" component={About} />

          {/* The component get the props as `id`. */}
          {/* <Route path="/profile/:id" component={Profile} /> */}

          {/* `default` prop indicates a fallback route. Useful for 404 pages */}
          <NotFound default />
        </Router>
      </ErrorBoundary>
    </LocationProvider>
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
