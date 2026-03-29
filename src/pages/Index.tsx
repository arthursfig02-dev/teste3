import Layout from "@/components/Layout";

const Index = () => (
  <Layout>
    <div className="mx-auto max-w-3xl rounded-xl border bg-card p-8 shadow-sm">
      <h2 className="text-xl font-bold text-foreground">
        Bem-vindo ao Formulários Congregacionais
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        Esta aplicação permite gerenciar os formulários da congregação de forma
        simples e organizada. Utilize o menu lateral para navegar entre as
        seções disponíveis:
      </p>
      <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
        <li className="flex items-start gap-2">
          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
          <span><strong className="text-foreground">Serviço de Campo</strong> — Registre e acompanhe os relatórios de serviço de campo.</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
          <span><strong className="text-foreground">Designações Mecânicas</strong> — Gerencie as designações mecânicas da congregação.</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
          <span><strong className="text-foreground">Vida e Ministério</strong> — Organize as partes da reunião Vida e Ministério.</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
          <span><strong className="text-foreground">Reunião Pública</strong> — Gerencie as designações da Reunião Pública.</span>
        </li>
      </ul>
    </div>
  </Layout>
);

export default Index;
