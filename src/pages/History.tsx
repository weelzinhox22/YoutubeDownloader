
import React, { useState, useEffect } from "react";
import { getDownloadHistory, deleteFromHistory, clearAllHistory } from "@/services/youtubeDownloadService";
import HistoryItem, { HistoryItemType } from "@/components/HistoryItem";
import NavigationBar from "@/components/NavigationBar";
import EmptyState from "@/components/EmptyState";
import { History as HistoryIcon, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/hooks/useAuth";
import UserMenu from "@/components/UserMenu";

const History = () => {
  const [history, setHistory] = useState<HistoryItemType[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user } = useAuth();
  
  useEffect(() => {
    const loadHistory = async () => {
      if (user) {
        const items = await getDownloadHistory();
        setHistory(items);
      }
    };
    
    loadHistory();
  }, [user]);
  
  const handleDelete = async (id: string) => {
    const updatedHistory = await deleteFromHistory(id);
    setHistory(updatedHistory);
    toast.success("Item removido do histórico");
  };
  
  const handleClearAll = async () => {
    await clearAllHistory();
    setHistory([]);
    setIsDialogOpen(false);
    toast.success("Histórico de downloads limpo");
  };
  
  return (
    <div className="min-h-screen pb-20">
      <div className="container max-w-md mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Histórico de Downloads</h1>
          
          <div className="flex gap-2">
            <UserMenu />
            
            {history.length > 0 && (
              <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="flex gap-1 items-center">
                    <Trash2 size={14} />
                    <span>Limpar</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Limpar histórico de downloads?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Isso irá excluir permanentemente todo o seu histórico de downloads. Esta ação não pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleClearAll}>
                      Limpar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
        
        <div className="space-y-4">
          {history.length > 0 ? (
            history.map((item) => (
              <HistoryItem 
                key={item.id} 
                item={item} 
                onDelete={handleDelete} 
              />
            ))
          ) : (
            <EmptyState
              icon={HistoryIcon}
              title="Nenhum histórico de download"
              description="Seu histórico de downloads aparecerá aqui quando você baixar vídeos ou músicas"
            />
          )}
        </div>
      </div>
      <NavigationBar />
    </div>
  );
};

export default History;
