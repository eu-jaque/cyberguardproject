import { useState } from "react";
import { Clock, Calendar, ChevronLeft, Shield, GraduationCap } from "lucide-react";
import { Expert } from "../pages/Experts";

const daysOfWeek = ["Seg", "Ter", "Qua", "Qui", "Sex"];
const timeSlots = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];

interface ScheduleFormProps {
  expert: Expert;
  onBack: () => void;
  onConfirm: (day: string, time: string) => void;
}

export default function ScheduleForm({ expert, onBack, onConfirm }: ScheduleFormProps) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const handleConfirmClick = () => {
    if (selectedDay !== null && selectedTime) {
      onConfirm(daysOfWeek[selectedDay], selectedTime);
    }
  };

  return (
    <section className="py-16 transition-colors duration-300">
      <div className="max-w-[1100px] mx-auto px-[2%]">
        <button onClick={onBack} className="flex items-center gap-2 text-primary mb-8 hover:underline font-medium transition-colors">
          <ChevronLeft className="w-4 h-4" /> Voltar aos especialistas
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Perfil do Especialista */}
          <div className="glass-card-static p-6 transition-colors duration-300">
            <div className="flex flex-col items-center mb-6">
              <div className="w-24 h-24 rounded-full border-4 border-primary overflow-hidden mb-4 transition-all">
                <img src={expert.image} alt={expert.name} className="w-full h-full object-cover" />
              </div>
              <h2 className="font-display text-lg font-bold text-foreground transition-colors">{expert.name}</h2>
              <p className="text-primary text-sm font-medium transition-colors">{expert.area}</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-gradient-gold mb-1 flex items-center gap-2">
                  <Shield className="w-4 h-4" /> Bio
                </h3>
                <p className="text-muted-foreground text-sm transition-colors">{expert.bio}</p>
              </div>
              <div>
                <h3 className="text-sm font-bold text-gradient-gold mb-1 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" /> Formação
                </h3>
                <p className="text-muted-foreground text-sm transition-colors">{expert.formation}</p>
              </div>
            </div>
          </div>

          {/* Seleção de Horários */}
          <div className="glass-card-static p-6 transition-colors duration-300">
            <h2 className="text-lg font-bold text-gradient-gold mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5" /> Escolha o Dia e Horário
            </h2>

            <div className="flex gap-2 mb-6 flex-wrap">
              {daysOfWeek.map((day, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedDay(i)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                    selectedDay === i 
                      ? "btn-gold-3d text-primary-foreground" 
                      : "bg-secondary text-foreground/70 hover:bg-secondary/80"
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>

            {selectedDay !== null && (
              <div className="grid grid-cols-3 gap-3 mb-6 animate-in fade-in duration-300">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`flex items-center justify-center gap-2 px-3 py-3 rounded-lg text-sm transition-all duration-300 ${
                      selectedTime === time 
                        ? "btn-gold-3d text-primary-foreground" 
                        : "bg-secondary/50 text-foreground/70 hover:bg-secondary"
                    }`}
                  >
                    <Clock className="w-3 h-3" /> {time}
                  </button>
                ))}
              </div>
            )}

            {selectedDay !== null && selectedTime && (
              <button 
                onClick={handleConfirmClick} 
                className="btn-gold-3d text-primary-foreground w-full py-3 rounded-lg text-sm font-bold mt-4 transition-all active:scale-98"
              >
                Confirmar Agendamento
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}