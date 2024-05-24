export function Home() {
  return (
    <div>
      <div className="flex justify-center items-center p-3">
        <div className="flex flex-col border rounded-md p-3">
          <div className="flex flex-row gap-3">
            imagem de preview do site
            <div className="flex flex-col gap-1">
              <div>Create Burger</div>
              <div>https://createburger.com.br/</div>
            </div>
            <div className="p-2 border flex text-green-600">Online</div>
          </div>
          <div className="flex flex-row justify-between">
            <div className="flex flex-col gap-1">
              <div>Rotas Cadastradas</div>
              <div className="p-4 border">5</div>
            </div>
            <div className="flex flex-col gap-1">
              <div>Rotas Funcionando</div>
              <div className="p-4 border">5</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
