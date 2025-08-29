"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckIcon, Badge } from "lucide-react";
import { 
  Subscription, 
  SubscriptionPlan, 
} from "@/types/api/subscription";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/lib/api-service";

interface UpgradePlanViewProps {
  subscription: Subscription;
  availablePlans: SubscriptionPlan[];
  onBack: () => void;
}

export default function UpgradePlanView({ subscription, availablePlans, onBack }: UpgradePlanViewProps) {
  const { toast } = useToast();
  const [duration, setDuration] = useState<"1" | "3" | "6" | "12">("1");
  const [isUpgrading, setIsUpgrading] = useState(false);

  const calculatePrice = (monthlyPrice: number, duration: number) => monthlyPrice * duration;

  const handleSubscription = async (plan: SubscriptionPlan) => {
    try {
      setIsUpgrading(true);
      await apiService.upgradeSubscription(subscription.id.toString(), plan.id, parseInt(duration));

      toast({
        title: "Plan upgraded",
        description: `You've successfully upgraded to the ${plan.name} plan for ${duration} month(s).`,
      });
    } catch {
      toast({
        title: "Upgrade failed",
        description: "Something went wrong upgrading your plan.",
        variant: "destructive",
      });
    } finally {
      setIsUpgrading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={onBack}>
        ← Back to Subscription Details
      </Button>

      <div className="mb-6 flex flex-wrap justify-center gap-2 sm:gap-3">
        {["1", "3", "6", "12"].map(m => (
          <button
            key={m}
            className={`px-4 py-2 rounded-md font-semibold text-sm ${
              duration === m ? "bg-primary text-white" : "bg-muted text-muted-foreground"
            }`}
            onClick={() => setDuration(m as any)}
          >
            {m === "1" ? "Monthly" : `${m} Months`}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {availablePlans.map(plan => {
          const price = calculatePrice(plan.price, parseInt(duration));
          const isCurrent = plan.name === subscription.plan.name;

          return (
            <Card key={plan.id} className="flex flex-col">
              <CardHeader className="text-center pb-2">
                {plan.name === "Professional" && (
                  <Badge className="uppercase w-max self-center mb-3">Most popular</Badge>
                )}
                <CardTitle className="mb-7">{plan.name}</CardTitle>
                <span className="font-bold text-2xl sm:text-3xl">₱{price.toFixed(2)}</span>
              </CardHeader>
              <CardDescription className="text-center w-11/12 mx-auto mb-4 text-sm">
                {plan.features?.[0] ?? "Flexible features"}
              </CardDescription>
              <CardContent className="flex-1">
                <ul className="mt-7 space-y-2.5 text-sm">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex space-x-2">
                      <CheckIcon className="flex-shrink-0 mt-0.5 h-4 w-4" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                {isCurrent ? (
                  <Button className="w-full" disabled>
                    Current Plan
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    variant={plan.name === "Professional" ? undefined : "ghost"}
                    onClick={() => handleSubscription(plan)}
                    disabled={isUpgrading}
                  >
                    {isUpgrading ? "Upgrading..." : "Subscribe"}
                  </Button>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
