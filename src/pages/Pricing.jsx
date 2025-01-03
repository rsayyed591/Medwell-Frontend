import React from 'react';
import { motion } from 'framer-motion';
import { CheckIcon, Heart, Brain, Stethoscope, Microscope } from 'lucide-react';

const pricingPlans = [
  {
    name: "Basic",
    price: "Free",
    features: ["AI-powered symptom checker", "Basic health insights", "Limited medical article access"],
    cta: "Get Started",
    highlighted: false,
    icon: Heart,
  },
  {
    name: "Pro",
    price: "$19",
    features: ["Advanced AI diagnostics", "Personalized health recommendations", "Unlimited medical article access", "24/7 chat support"],
    cta: "Upgrade to Pro",
    highlighted: true,
    icon: Brain,
  },
  {
    name: "Enterprise",
    price: "Custom",
    features: ["Custom AI model integration", "Dedicated account manager", "API access", "Advanced analytics"],
    cta: "Contact Sales",
    highlighted: false,
    icon: Microscope,
  },
];

export default function Pricing() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-[#AEDFF7] to-[#FFFFFF]">
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <motion.h2 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center text-4xl font-bold tracking-tight text-[#005B96] sm:text-5xl"
        >
          Choose Your MedWell Plan
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mx-auto mt-4 max-w-2xl text-center text-xl text-[#003E5C]"
        >
          Select the perfect plan to unlock the full potential of AI-powered healthcare
        </motion.p>
        <div className="mt-24 space-y-12 lg:grid lg:grid-cols-3 lg:gap-x-8 lg:space-y-0">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className={`rounded-2xl bg-white p-8 shadow-lg ring-1 ring-[#AEDFF7] transition-all hover:shadow-xl ${
                plan.highlighted ? "lg:scale-110 bg-[#AEDFF7]" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-[#005B96]">{plan.name}</h3>
                <plan.icon className={`h-8 w-8 ${plan.highlighted ? 'text-[#005B96]' : 'text-[#003E5C]'}`} />
              </div>
              <p className="mt-4 flex items-baseline text-[#005B96]">
                <span className="text-5xl font-bold tracking-tight">{plan.price}</span>
                {plan.price !== "Custom" && <span className="ml-1 text-xl font-semibold">/month</span>}
              </p>
              <ul className="mt-6 space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <div className="flex-shrink-0">
                      <CheckIcon className="h-6 w-6 text-[#8FCB9B]" />
                    </div>
                    <p className="ml-3 text-base text-[#003E5C]">{feature}</p>
                  </li>
                ))}
              </ul>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`mt-8 block w-full rounded-md px-3 py-2 text-center text-sm font-semibold shadow-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  plan.highlighted
                    ? "bg-[#005B96] text-white hover:bg-[#003E5C] focus-visible:outline-[#005B96]"
                    : "bg-[#AEDFF7] text-[#005B96] hover:bg-[#8FCB9B] focus-visible:outline-[#AEDFF7]"
                }`}
              >
                {plan.cta}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

