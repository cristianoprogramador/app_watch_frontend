import { useTheme } from "../../contexts/ThemeContext";

interface GitHubButtonProps {
  link: string;
  text: string;
}

export function Settings() {
  const { theme, toggleTheme } = useTheme();

  const GitHubButton = ({ link, text }: GitHubButtonProps) => {
    const handleClick = () => {
      window.open(link, "_blank");
    };

    return (
      <button
        className="flex flex-col items-center hover:bg-gray-400 text-center justify-between w-full border border-gray-500 rounded-lg p-4"
        onClick={handleClick}
      >
        <div>{text}</div>
      </button>
    );
  };

  const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTheme = event.target.value;
    if (selectedTheme !== theme) {
      toggleTheme();
    }
  };

  return (
    <div className="flex flex-col justify-center gap-10 items-center h-full">
      <div className="w-[50%] max-w-[400px] bg-gray-200 flex flex-col justify-center items-center border rounded-lg">
        <div className="w-[90%] px-4">
          <div className="text-center py-5 font-semibold text-xl text-gray-800">
            Preferências Gerais
          </div>
          <div className="flex flex-col gap-2 py-5">
            <div className="flex flex-row justify-between w-full border border-gray-500 rounded-lg p-4">
              <div>Idioma</div>
              <div>Português</div>
            </div>
            <div className="flex flex-row justify-between w-full border border-gray-500 rounded-lg p-4">
              <div>Exibição</div>
              <select className="bg-transparent" onChange={handleThemeChange} value={theme}>
                <option value="light">Modo Claro</option>
                <option value="dark">Modo Escuro</option>
              </select>
            </div>
            <div className="flex flex-row justify-between w-full border border-gray-500 rounded-lg p-4">
              <div>Tempo de Atualização</div>
              <div>1 Minuto</div>
            </div>
          </div>
        </div>
        <div className="w-[90%] px-4">
          <div className="text-center mb-5 font-semibold text-xl text-gray-800">
            Código
          </div>
          <div className="flex flex-col gap-2 mb-5">
            <GitHubButton
              link="https://github.com/cristianoprogramador"
              text="GitHub - Cristiano"
            />
            <GitHubButton
              link="https://github.com/cristianoprogramador/app_watch_frontend"
              text="GitHub - Frontend"
            />
            <GitHubButton
              link="https://github.com/cristianoprogramador/app_watch_backend"
              text="GitHub - Backend"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
