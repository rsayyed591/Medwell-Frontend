import React from 'react';
import { motion } from 'framer-motion';
import { CheckIcon } from "lucide-react";

const pricingPlans = [
  {
    name: "Basic",
    price: "Free",
    features: ["AI-powered symptom checker", "Basic health insights", "Limited medical article access"],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$19",
    features: ["Advanced AI diagnostics", "Personalized health recommendations", "Unlimited medical article access", "24/7 chat support"],
    cta: "Upgrade to Pro",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    features: ["Custom AI model integration", "Dedicated account manager", "API access", "Advanced analytics"],
    cta: "Contact Sales",
    highlighted: false,
  },
];

export default function Pricing() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-[#2c5364] via-[#203a43] to-[#0f2027]">
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <motion.h2 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center text-4xl font-bold tracking-tight text-white sm:text-5xl"
        >
          Choose Your MedWell Plan
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mx-auto mt-4 max-w-2xl text-center text-xl text-gray-300"
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
              className={`rounded-2xl bg-white bg-opacity-10 p-8 shadow-lg ring-1 ring-white/10 backdrop-blur-lg transition-all hover:bg-opacity-20 hover:shadow-xl ${
                plan.highlighted ? "lg:scale-110" : ""
              }`}
            >
              <h3 className="text-xl font-semibold text-white">{plan.name}</h3>
              <p className="mt-4 flex items-baseline text-white">
                <span className="text-5xl font-bold tracking-tight">{plan.price}</span>
                {plan.price !== "Custom" && <span className="ml-1 text-xl font-semibold">/month</span>}
              </p>
              <ul className="mt-6 space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <div className="flex-shrink-0">
                      <CheckIcon className="h-6 w-6 text-green-400" />
                    </div>
                    <p className="ml-3 text-base text-gray-300">{feature}</p>
                  </li>
                ))}
              </ul>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`mt-8 block w-full rounded-md px-3 py-2 text-center text-sm font-semibold shadow-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  plan.highlighted
                    ? "bg-blue-600 text-white hover:bg-blue-500 focus-visible:outline-blue-600"
                    : "bg-white/10 text-white hover:bg-white/20 focus-visible:outline-white"
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