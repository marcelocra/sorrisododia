import { lazy } from "preact-iso";

import "./style.css";

function NotFoundComp() {
  return (
    <div class="flex flex-col gap-3 items-center">
      <div>Nada por aqui. Mas tudo bem, é só voltar!</div>
      <a class="btn btn-sm uppercase btn-primary" href="/">
        Voltar
      </a>
    </div>
  );
}

export const NotFound = lazy(() => Promise.resolve(NotFoundComp));
