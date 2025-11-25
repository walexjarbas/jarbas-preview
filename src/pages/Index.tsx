
import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { BehaviorTabs } from '@/components/BehaviorTabs';
import { BehaviorAccordion } from '@/components/BehaviorAccordion';
import { PersonalizationSection } from '@/components/PersonalizationSection';
import { ChatWidget } from '@/components/ChatWidget';
import { ActionButtons } from '@/components/ActionButtons';
import { DevMode } from '@/components/DevMode';
import { useJarbasState } from '@/hooks/useJarbasState';
import { useToast } from '@/hooks/use-toast';

const IndexContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('behavior');
  const jarbasState = useJarbasState();
  const { toast } = useToast();

  const handleCancel = () => {
    jarbasState.resetState();
    toast({
      title: "Alterações canceladas",
      description: "Todas as alterações foram revertidas."
    });
  };

  const handleSave = () => {
    const success = jarbasState.saveAllChanges();
    
    if (success) {
      toast({
        title: "Alterações salvas",
        description: "Todas as configurações foram salvas com sucesso!"
      });
    } else {
      toast({
        title: "Erro ao salvar",
        description: "Houve um erro ao salvar as configurações.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar />
      
      <main className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr,360px] lg:gap-12">
          {/* Main Content */}
          <section className="space-y-6">
            <BehaviorTabs activeTab={activeTab} onTabChange={setActiveTab} />
            
            {activeTab === 'behavior' && (
              <>
                <div className="space-y-2">
                  <h1 className="text-xl font-stix font-bold text-foreground sm:text-2xl">
                    Defina o comportamento
                  </h1>
                  <p className="text-sm text-muted-foreground sm:text-base">
                    Defina como Jarbas deve se parecer e se comportar com os usuários
                  </p>
                </div>
                <BehaviorAccordion jarbasState={jarbasState} />
              </>
            )}
            
            {activeTab === 'personalization' && (
              <>
                <div className="space-y-2">
                  <h1 className="text-xl font-stix font-bold text-foreground sm:text-2xl">
                    Personalize a conversa
                  </h1>
                  <p className="text-sm text-muted-foreground sm:text-base">
                    Simule uma interação hiper personalizada com seu cliente
                  </p>
                </div>
                <PersonalizationSection
                  isExpanded={true}
                  onToggle={() => {}}
                  jarbasState={jarbasState}
                />
              </>
            )}

            {/* Fallback for invalid tab state - prevents blank screen */}
            {activeTab !== 'behavior' && activeTab !== 'personalization' && (
              <div className="text-center p-8 text-muted-foreground">
                <p>Selecione uma aba acima para continuar.</p>
              </div>
            )}

            <ActionButtons 
              onCancel={handleCancel} 
              onSave={handleSave}
              hasChanges={jarbasState.hasChanges}
            />
          </section>
          
          {/* Chat Widget */}
          <div className="order-first lg:order-last lg:sticky lg:top-6 lg:self-start">
            <ChatWidget />
          </div>
        </div>
      </main>
    </div>
  );
};

const Index: React.FC = () => {
  return (
    <>
      <IndexContent />
      <DevMode />
    </>
  );
};

export default Index;
