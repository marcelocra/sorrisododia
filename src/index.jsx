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

import { NotFound } from "./404.jsx";
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

function ExternalLinkSvg() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.33333 3.33333C8.96514 3.33333 8.66667 3.03486 8.66667 2.66667C8.66667 2.29848 8.96514 2 9.33333 2H13.3333C13.5101 2 13.6797 2.07024 13.8047 2.19526C13.9298 2.32029 14 2.48986 14 2.66667L14 6.66667C14 7.03486 13.7015 7.33333 13.3333 7.33333C12.9651 7.33333 12.6667 7.03486 12.6667 6.66667L12.6667 4.27614L6.4714 10.4714C6.21106 10.7318 5.78894 10.7318 5.5286 10.4714C5.26825 10.2111 5.26825 9.78894 5.5286 9.52859L11.7239 3.33333H9.33333ZM2 4.66667C2 3.93029 2.59695 3.33333 3.33333 3.33333H6.66667C7.03486 3.33333 7.33333 3.63181 7.33333 4C7.33333 4.36819 7.03486 4.66667 6.66667 4.66667H3.33333V12.6667H11.3333V9.33333C11.3333 8.96514 11.6318 8.66667 12 8.66667C12.3682 8.66667 12.6667 8.96514 12.6667 9.33333V12.6667C12.6667 13.403 12.0697 14 11.3333 14H3.33333C2.59695 14 2 13.403 2 12.6667V4.66667Z"
        fill="currentColor"
      ></path>
    </svg>
  );
}

function HomeSync() {
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

/**
 * @param {any} props
 */
function AboutSync(props) {
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

const Home = lazy(() => Promise.resolve(HomeSync));
const About = lazy(() => Promise.resolve(AboutSync));

/**
 * @type {Record<string, {component: any, options?: {default: boolean}}>}
 */
const pathToComponent = {
  "/": { component: Home },
  "/about": { component: About },
  "/404": { component: NotFound, options: { default: true } },
};

export function App() {
  return (
    <LocationProvider>
      <ErrorBoundary>
        <Router>
          {Object.entries(pathToComponent).map(([path, config]) => (
            <Route
              path={path}
              component={config.component}
              {...config.options}
            />
          ))}
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
  const { html, links: discoveredLinks } = await ssr(<App {...data} />);

  return {
    html,
    links: new Set([
      ...(discoveredLinks ?? []),
      ...Object.keys(pathToComponent),
    ]),
  };
}
