import React from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
interface WelcomeCardProps {
  userName: string;
}
const WelcomeCard = ({
  userName
}: WelcomeCardProps) => {
  return <Card className="bg-gradient-to-r from-primary/20 to-blue-600/20 border-none shadow-lg transition-all duration-300 hover:shadow-xl">
      <CardContent className="p-6 flex flex-col md:flex-row justify-between items-center mx-0 px-0">
        <div className="animate-slide-in">
          <h2 className="text-2xl font-semibold mb-2 px-[10px]">
            Olá {userName}, bem vindo!
          </h2>
          <p className="text-muted-foreground max-w-xl px-[10px]">
            Com a Infinity CRM você gerencia todos seus trabalhos com praticidade de forma inteligente!
          </p>
        </div>
        <Button className="mt-4 md:mt-0 bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm transition-all duration-300 hover:scale-105" size="sm">
          News <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>;
};
export default WelcomeCard;