
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Mail, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const WaitingArea = () => {
  const { signOut, user } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-gray-900 to-black p-4">
      <Card className="w-full max-w-md bg-black/40 border-white/10 backdrop-blur-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
            <Clock className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-white">Conta em Análise</CardTitle>
          <CardDescription className="text-white/70">
            Sua conta de colaborador foi criada com sucesso
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-white/80">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span className="text-sm">Conta criada com sucesso</span>
            </div>
            <div className="flex items-center space-x-3 text-white/80">
              <Mail className="w-5 h-5 text-blue-500 flex-shrink-0" />
              <span className="text-sm">Aguardando convite de uma empresa</span>
            </div>
            <div className="flex items-center space-x-3 text-white/60">
              <Clock className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">Acesso será liberado em breve</span>
            </div>
          </div>
          
          <div className="bg-white/5 rounded-lg p-4 text-left">
            <h4 className="font-medium text-white mb-2">Próximos passos:</h4>
            <ul className="text-sm text-white/70 space-y-1">
              <li>• Entre em contato com o administrador da empresa</li>
              <li>• Aguarde o convite por email</li>
              <li>• Verifique sua caixa de entrada regularmente</li>
            </ul>
          </div>

          <div className="pt-4 border-t border-white/10">
            <p className="text-xs text-white/60 mb-3">
              Logado como: {user?.email}
            </p>
            <Button 
              variant="outline" 
              onClick={signOut}
              className="w-full border-white/20 text-white hover:bg-white/5"
            >
              Fazer logout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WaitingArea;
