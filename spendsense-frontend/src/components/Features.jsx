import React from 'react';
import { PieChart, ShieldCheck, ArrowLeftRight, FileDown } from 'lucide-react';

const features = [
  {
    name: 'Visual Analytics',
    description: 'Understand your spending habits instantly with beautiful, interactive Recharts showing where every dollar goes.',
    icon: PieChart,
    color: 'from-blue-500 to-cyan-400',
    bgColor: 'bg-blue-500/10 dark:bg-blue-500/20',
    iconColor: 'text-blue-600 dark:text-blue-400'
  },
  {
    name: 'Smart Tracking',
    description: 'Log incomes and expenses with category tagging. See your total balance update in real-time without page reloads.',
    icon: ArrowLeftRight,
    color: 'from-brand-500 to-purple-500',
    bgColor: 'bg-brand-500/10 dark:bg-brand-500/20',
    iconColor: 'text-brand-600 dark:text-brand-400'
  },
  {
    name: 'Bank-Grade Security',
    description: 'Built on a rock-solid Spring Boot foundation, ensuring your personal financial data stays completely private and secure.',
    icon: ShieldCheck,
    color: 'from-emerald-500 to-teal-400',
    bgColor: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    iconColor: 'text-emerald-600 dark:text-emerald-400'
  },
  {
    name: 'Data Portability',
    description: 'Your data belongs to you. Seamlessly import existing transactions or export your history to CSV whenever you need.',
    icon: FileDown,
    color: 'from-orange-500 to-red-400',
    bgColor: 'bg-orange-500/10 dark:bg-orange-500/20',
    iconColor: 'text-orange-600 dark:text-orange-400'
  }
];

export default function Features() {
  return (
    <div className="bg-white dark:bg-black py-24 sm:py-32 transition-colors duration-300 relative z-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center mb-16 sm:mb-20">
          <h2 className="text-base font-semibold leading-7 text-brand-600 dark:text-brand-400 uppercase tracking-wide">
            Everything you need
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            No clutter. Just clarity.
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400">
            SpendSense is built to get out of your way. We stripped out the confusing menus and left only the powerful tools you actually use.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="mx-auto max-w-2xl sm:mt-20 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-12 lg:max-w-none lg:grid-cols-4">
            {features.map((feature) => (
              <div 
                key={feature.name} 
                className="group relative flex flex-col items-start bg-gray-50 dark:bg-[#121212] p-8 rounded-3xl border border-gray-200 dark:border-white/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-gray-200 dark:hover:shadow-white/5"
              >
                {/* Glowing Top Border on Hover */}
                <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-3xl bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                
                {/* Icon Container */}
                <div className={`rounded-xl p-3 ring-1 ring-inset ring-gray-900/5 dark:ring-white/10 mb-6 transition-colors duration-300 ${feature.bgColor}`}>
                  <feature.icon className={`h-6 w-6 ${feature.iconColor}`} aria-hidden="true" />
                </div>
                
                {/* Text Content */}
                <dt className="text-xl font-semibold leading-7 text-gray-900 dark:text-white mb-3">
                  {feature.name}
                </dt>
                <dd className="flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-400">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>

      </div>
    </div>
  );
}