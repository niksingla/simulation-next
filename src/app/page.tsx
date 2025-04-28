"use client"

import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import { FaAtom, FaBusinessTime, FaChartLine, FaFlask } from "react-icons/fa";
import { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import ClipLoader from 'react-spinners/ClipLoader';

const poppins = Poppins({
  display: 'swap',
  preload: false,
  style: ['normal', 'italic'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin', 'latin-ext'],
});

const metadata: Metadata = {
  title: 'Task 1',
  description: 'An Outlier Task',
};
const viewport: Viewport = {
  themeColor: '#18181b',
};

export default function Home() {
  const isSidebarEnabled = false;
  const categories = ['Chemistry', 'Physics', 'Finance', 'Business Strategies']
  type Category = typeof categories[number];
  const [category, setCategory] = useState<Category>('');
  const [isShowModal, setIsShowModal] = useState(false)
  const [widget, setWidget] = useState({})

  const openModal = () => {
    setIsShowModal(true);
  };


  const simulations = {
    chemistry: [
      {
        id: 'acid-base-reaction',
        label: 'Acid-Base Reaction',
        description: 'Calculate the resulting pH when acids and bases are mixed.',
        inputs: [
          { id: 'acidConcentration', label: 'Acid Concentration (M)', type: 'number', defaultValue: 0.1 },
          { id: 'baseConcentration', label: 'Base Concentration (M)', type: 'number', defaultValue: 0.1 },
        ],
        widget: ({ acidConcentration, baseConcentration }: { acidConcentration: number; baseConcentration: number }) => {
          const pH = Math.round((acidConcentration - baseConcentration) * 10) / 10;
          return (
            <div className="mt-2">
              <p className="text-gray-700">pH: {pH}</p>
            </div>
          );
        },
      },
      {
        id: 'ideal-gas-law',
        label: 'Ideal Gas Law',
        description: 'Find the number of gas moles using pressure, volume, and temperature.',
        inputs: [
          { id: 'pressure', label: 'Pressure (atm)', type: 'number', defaultValue: 1 },
          { id: 'volume', label: 'Volume (L)', type: 'number', defaultValue: 22.4 },
          { id: 'temperature', label: 'Temperature (K)', type: 'number', defaultValue: 273 },
        ],
        widget: ({ pressure, volume, temperature }: { pressure: number; volume: number; temperature: number }) => {
          const R = 0.0821;
          const moles = (pressure * volume) / (R * temperature);
          return (
            <div className="mt-2">
              <p className="text-gray-700">Moles of Gas: {moles.toFixed(3)} mol</p>
            </div>
          );
        },
      },
      {
        id: 'reaction-rate',
        label: 'Reaction Rate',
        description: 'Calculate the rate of a chemical reaction based on concentration change and time.',
        inputs: [
          { id: 'changeInConcentration', label: 'ΔConcentration (M)', type: 'number', defaultValue: 0.5 },
          { id: 'changeInTime', label: 'ΔTime (s)', type: 'number', defaultValue: 10 },
        ],
        widget: ({ changeInConcentration, changeInTime }: { changeInConcentration: number; changeInTime: number }) => {
          const rate = changeInConcentration / changeInTime;
          return (
            <div className="mt-2">
              <p className="text-gray-700">Reaction Rate: {rate.toFixed(3)} M/s</p>
            </div>
          );
        },
      },
      {
        id: 'boiling-point-elevation',
        label: 'Boiling Point Elevation',
        description: 'Calculate the change in boiling point based on the solute concentration.',
        inputs: [
          { id: 'molality', label: 'Molality (mol/kg)', type: 'number', defaultValue: 1 },
          { id: 'kb', label: 'Ebullioscopic Constant (°C·kg/mol)', type: 'number', defaultValue: 0.512 },
        ],
        widget: ({ molality, kb }: { molality: number; kb: number }) => {
          const deltaTb = kb * molality;
          return (
            <div className="mt-2">
              <p className="text-gray-700">Boiling Point Elevation: {deltaTb.toFixed(2)} °C</p>
            </div>
          );
        },
      },
      {
        id: 'enthalpy-change',
        label: 'Enthalpy Change',
        description: 'Calculate the heat required to change the temperature of a substance.',
        inputs: [
          { id: 'mass', label: 'Mass (g)', type: 'number', defaultValue: 50 },
          { id: 'specificHeat', label: 'Specific Heat (J/g°C)', type: 'number', defaultValue: 4.18 },
          { id: 'temperatureChange', label: 'Temperature Change (°C)', type: 'number', defaultValue: 10 },
        ],
        widget: ({ mass, specificHeat, temperatureChange }: { mass: number; specificHeat: number; temperatureChange: number }) => {
          const q = mass * specificHeat * temperatureChange;
          return (
            <div className="mt-2">
              <p className="text-gray-700">Heat (q): {q.toFixed(2)} J</p>
            </div>
          );
        },
      },
      {
        id: 'molarity-calculation',
        label: 'Molarity Calculation',
        description: 'Calculate the molarity of a solution based on solute and volume.',
        inputs: [
          { id: 'molesOfSolute', label: 'Moles of Solute (mol)', type: 'number', defaultValue: 1 },
          { id: 'volumeOfSolution', label: 'Volume of Solution (L)', type: 'number', defaultValue: 1 },
        ],
        widget: ({ molesOfSolute, volumeOfSolution }: { molesOfSolute: number; volumeOfSolution: number }) => {
          const molarity = molesOfSolute / volumeOfSolution;
          return (
            <div className="mt-2">
              <p className="text-gray-700">Molarity: {molarity.toFixed(2)} M</p>
            </div>
          );
        },
      },
    ],
    physics: [
      {
        id: 'projectile-motion',
        label: 'Projectile Motion',
        description: 'Simulate the motion of an object projected into the air with a given velocity and angle. Calculate the horizontal range of the projectile.',
        inputs: [
          { id: 'initialVelocity', label: 'Initial Velocity (m/s)', type: 'number', defaultValue: 10 },
          { id: 'angle', label: 'Angle (°)', type: 'number', defaultValue: 45 },
        ],
        widget: ({ initialVelocity, angle }: { initialVelocity: number; angle: number }) => {
          const range = (initialVelocity ** 2) * Math.sin(2 * (angle * Math.PI / 180)) / 9.81;
          return (
            <div className="mt-2">
              <p className="text-gray-700">Range: {range.toFixed(2)} m</p>
            </div>
          );
        },
      },
      {
        id: 'ohms-law',
        label: 'Ohm\'s Law',
        description: 'Simulate the relationship between voltage, current, and resistance in an electrical circuit. Calculate current or resistance given the voltage and resistance or current.',
        inputs: [
          { id: 'voltage', label: 'Voltage (V)', type: 'number', defaultValue: 10 },
          { id: 'resistance', label: 'Resistance (Ω)', type: 'number', defaultValue: 5 },
        ],
        widget: ({ voltage, resistance }: { voltage: number; resistance: number }) => {
          const current = voltage / resistance;
          return (
            <div className="mt-2">
              <p className="text-gray-700">Current: {current.toFixed(2)} A</p>
            </div>
          );
        },
      },
      {
        id: 'kinetic-energy',
        label: 'Kinetic Energy',
        description: 'Calculate the kinetic energy of an object given its mass and velocity using the formula KE = 1/2 * m * v^2.',
        inputs: [
          { id: 'mass', label: 'Mass (kg)', type: 'number', defaultValue: 1 },
          { id: 'velocity', label: 'Velocity (m/s)', type: 'number', defaultValue: 10 },
        ],
        widget: ({ mass, velocity }: { mass: number; velocity: number }) => {
          const kineticEnergy = 0.5 * mass * velocity ** 2;
          return (
            <div className="mt-2">
              <p className="text-gray-700">Kinetic Energy: {kineticEnergy.toFixed(2)} J</p>
            </div>
          );
        },
      },
      {
        id: 'gravitational-force',
        label: 'Gravitational Force',
        description: 'Calculate the gravitational force between two objects based on their masses and the distance between them using Newton\'s law of gravitation.',
        inputs: [
          { id: 'mass1', label: 'Mass 1 (kg)', type: 'number', defaultValue: 5 },
          { id: 'mass2', label: 'Mass 2 (kg)', type: 'number', defaultValue: 5 },
          { id: 'distance', label: 'Distance (m)', type: 'number', defaultValue: 10 },
        ],
        widget: ({ mass1, mass2, distance }: { mass1: number; mass2: number; distance: number }) => {
          const G = 6.67430e-11;
          const force = (G * mass1 * mass2) / distance ** 2;
          return (
            <div className="mt-2">
              <p className="text-gray-700">Gravitational Force: {force.toFixed(2)} N</p>
            </div>
          );
        },
      },
      {
        id: 'newton-second-law',
        label: 'Newton\'s Second Law',
        description: 'Calculate the acceleration of an object given its mass and the applied force using the formula F = m * a.',
        inputs: [
          { id: 'force', label: 'Force (N)', type: 'number', defaultValue: 10 },
          { id: 'mass', label: 'Mass (kg)', type: 'number', defaultValue: 2 },
        ],
        widget: ({ force, mass }: { force: number; mass: number }) => {
          const acceleration = force / mass;
          return (
            <div className="mt-2">
              <p className="text-gray-700">Acceleration: {acceleration.toFixed(2)} m/s²</p>
            </div>
          );
        },
      }
    ],
    finance: [
      {
        id: 'compound-interest',
        label: 'Compound Interest',
        description: 'Calculate the future value of an investment with compound interest over time. You can specify the principal amount, interest rate, and time period.',
        inputs: [
          { id: 'principal', label: 'Principal ($)', type: 'number', defaultValue: 1000 },
          { id: 'rate', label: 'Interest Rate (%)', type: 'number', defaultValue: 5 },
          { id: 'time', label: 'Time (years)', type: 'number', defaultValue: 5 },
        ],
        widget: ({ principal, rate, time }: { principal: number; rate: number; time: number }) => {
          const amount = principal * (1 + rate / 100) ** time;
          return (
            <div className="mt-2">
              <p className="text-gray-700">Amount: {amount.toFixed(2)} $</p>
            </div>
          );
        },
      },
      {
        id: 'simple-interest',
        label: 'Simple Interest',
        description: 'Calculate the simple interest on a loan or investment using the formula: Interest = Principal x Rate x Time.',
        inputs: [
          { id: 'principal', label: 'Principal ($)', type: 'number', defaultValue: 1000 },
          { id: 'rate', label: 'Interest Rate (%)', type: 'number', defaultValue: 5 },
          { id: 'time', label: 'Time (years)', type: 'number', defaultValue: 5 },
        ],
        widget: ({ principal, rate, time }: { principal: number; rate: number; time: number }) => {
          const interest = (principal * rate * time) / 100;
          return (
            <div className="mt-2">
              <p className="text-gray-700">Interest: {interest.toFixed(2)} $</p>
            </div>
          );
        },
      },
      {
        id: 'loan-payment',
        label: 'Loan Payment',
        description: 'Calculate the monthly payment for a loan using the loan amount, interest rate, and loan term.',
        inputs: [
          { id: 'loanAmount', label: 'Loan Amount ($)', type: 'number', defaultValue: 10000 },
          { id: 'interestRate', label: 'Interest Rate (%)', type: 'number', defaultValue: 5 },
          { id: 'loanTerm', label: 'Loan Term (years)', type: 'number', defaultValue: 5 },
        ],
        widget: ({ loanAmount, interestRate, loanTerm }: { loanAmount: number; interestRate: number; loanTerm: number }) => {
          const monthlyRate = interestRate / 100 / 12;
          const numberOfPayments = loanTerm * 12;
          const monthlyPayment = (loanAmount * monthlyRate) / (1 - (1 + monthlyRate) ** -numberOfPayments);
          return (
            <div className="mt-2">
              <p className="text-gray-700">Monthly Payment: {monthlyPayment.toFixed(2)} $</p>
            </div>
          );
        },
      },
      {
        id: 'roi-calculator',
        label: 'Return on Investment (ROI)',
        description: 'Calculate the ROI for an investment based on the initial investment, final value, and any additional costs.',
        inputs: [
          { id: 'initialInvestment', label: 'Initial Investment ($)', type: 'number', defaultValue: 1000 },
          { id: 'finalValue', label: 'Final Value ($)', type: 'number', defaultValue: 1200 },
          { id: 'additionalCosts', label: 'Additional Costs ($)', type: 'number', defaultValue: 0 },
        ],
        widget: ({ initialInvestment, finalValue, additionalCosts }: { initialInvestment: number; finalValue: number; additionalCosts: number }) => {
          const roi = ((finalValue - initialInvestment - additionalCosts) / initialInvestment) * 100;
          return (
            <div className="mt-2">
              <p className="text-gray-700">ROI: {roi.toFixed(2)}%</p>
            </div>
          );
        },
      },
      {
        id: 'monthly-budget',
        label: 'Monthly Budget',
        description: 'Track your monthly income and expenses to calculate your savings potential.',
        inputs: [
          { id: 'income', label: 'Monthly Income ($)', type: 'number', defaultValue: 3000 },
          { id: 'expenses', label: 'Monthly Expenses ($)', type: 'number', defaultValue: 1500 },
        ],
        widget: ({ income, expenses }: { income: number; expenses: number }) => {
          const savings = income - expenses;
          return (
            <div className="mt-2">
              <p className="text-gray-700">Savings: {savings.toFixed(2)} $</p>
            </div>
          );
        },
      },
      {
        id: 'savings-goal',
        label: 'Savings Goal',
        description: 'Calculate how much you need to save monthly to reach your savings goal in a given time frame.',
        inputs: [
          { id: 'goalAmount', label: 'Savings Goal ($)', type: 'number', defaultValue: 5000 },
          { id: 'timeFrame', label: 'Time Frame (months)', type: 'number', defaultValue: 12 },
        ],
        widget: ({ goalAmount, timeFrame }: { goalAmount: number; timeFrame: number }) => {
          const monthlySavings = goalAmount / timeFrame;
          return (
            <div className="mt-2">
              <p className="text-gray-700">Monthly Savings Needed: {monthlySavings.toFixed(2)} $</p>
            </div>
          );
        },
      },
    ],

    'business-strategies': [
      {
        id: 'break-even-analysis',
        label: 'Break-Even Analysis',
        description: 'Calculate the break-even point where total revenue equals total costs, helping businesses understand when they will start making a profit.',
        inputs: [
          { id: 'fixedCosts', label: 'Fixed Costs ($)', type: 'number', defaultValue: 1000 },
          { id: 'variableCosts', label: 'Variable Costs ($/unit)', type: 'number', defaultValue: 5 },
          { id: 'sellingPrice', label: 'Selling Price ($/unit)', type: 'number', defaultValue: 10 },
        ],
        widget: ({ fixedCosts, variableCosts, sellingPrice }: { fixedCosts: number; variableCosts: number; sellingPrice: number }) => {
          const denominator = sellingPrice - variableCosts;
          const breakEvenPoint = denominator !== 0 ? (fixedCosts / denominator) : NaN;
          return (
            <div className="mt-2">
              <p className="text-gray-700">
                Break-Even Point: {isNaN(breakEvenPoint) ? 'Undefined (Selling Price must be greater than Variable Costs)' : breakEvenPoint.toFixed(2)} units
              </p>
            </div>
          );
        },
      },
      {
        id: 'profit-margin',
        label: 'Profit Margin',
        description: 'Calculate the profit margin percentage to understand how much profit you make from each sale after covering costs.',
        inputs: [
          { id: 'revenue', label: 'Revenue ($)', type: 'number', defaultValue: 5000 },
          { id: 'costs', label: 'Costs ($)', type: 'number', defaultValue: 3000 },
        ],
        widget: ({ revenue, costs }: { revenue: number; costs: number }) => {
          const profit = revenue - costs;
          const profitMargin = (profit / revenue) * 100;
          return (
            <div className="mt-2">
              <p className="text-gray-700">Profit Margin: {profitMargin.toFixed(2)}%</p>
            </div>
          );
        },
      },
      {
        id: 'roi-analysis',
        label: 'Return on Investment (ROI) Analysis',
        description: 'Analyze the return on investment (ROI) to understand the profitability of your business investments.',
        inputs: [
          { id: 'investment', label: 'Investment ($)', type: 'number', defaultValue: 10000 },
          { id: 'return', label: 'Return ($)', type: 'number', defaultValue: 12000 },
        ],
        widget: ({ investment, returnOnInvestment }: { investment: number; returnOnInvestment: number }) => {
          const roi = ((returnOnInvestment - investment) / investment) * 100;
          return (
            <div className="mt-2">
              <p className="text-gray-700">ROI: {roi.toFixed(2)}%</p>
            </div>
          );
        },
      },
      {
        id: 'customer-acquisition-cost',
        label: 'Customer Acquisition Cost (CAC)',
        description: 'Calculate the cost of acquiring a new customer, which is important for understanding the effectiveness of marketing strategies.',
        inputs: [
          { id: 'marketingCosts', label: 'Marketing Costs ($)', type: 'number', defaultValue: 2000 },
          { id: 'newCustomers', label: 'New Customers', type: 'number', defaultValue: 100 },
        ],
        widget: ({ marketingCosts, newCustomers }: { marketingCosts: number; newCustomers: number }) => {
          const cac = newCustomers !== 0 ? marketingCosts / newCustomers : NaN;
          return (
            <div className="mt-2">
              <p className="text-gray-700">Customer Acquisition Cost: {isNaN(cac) ? 'Undefined (Must have new customers)' : cac.toFixed(2)} $</p>
            </div>
          );
        },
      },
      {
        id: 'breakeven-timeframe',
        label: 'Break-Even Timeframe',
        description: 'Estimate the time required to reach the break-even point based on the business’s current performance and assumptions.',
        inputs: [
          { id: 'monthlySales', label: 'Monthly Sales ($)', type: 'number', defaultValue: 2000 },
          { id: 'fixedCosts', label: 'Fixed Costs ($)', type: 'number', defaultValue: 10000 },
        ],
        widget: ({ monthlySales, fixedCosts }: { monthlySales: number; fixedCosts: number }) => {
          const timeToBreakEven = monthlySales !== 0 ? fixedCosts / monthlySales : NaN;
          return (
            <div className="mt-2">
              <p className="text-gray-700">
                Break-Even Timeframe: {isNaN(timeToBreakEven) ? 'Undefined (Monthly Sales cannot be 0)' : timeToBreakEven.toFixed(2)} months
              </p>
            </div>
          );
        },
      },
      {
        id: 'net-present-value',
        label: 'Net Present Value (NPV)',
        description: 'Calculate the Net Present Value (NPV) of future cash flows to determine the profitability of a business project.',
        inputs: [
          { id: 'initialInvestment', label: 'Initial Investment ($)', type: 'number', defaultValue: 10000 },
          { id: 'cashFlows', label: 'Future Cash Flows ($)', type: 'number', defaultValue: 5000 },
          { id: 'discountRate', label: 'Discount Rate (%)', type: 'number', defaultValue: 5 },
          { id: 'years', label: 'Number of Years', type: 'number', defaultValue: 5 },
        ],
        widget: ({ initialInvestment, cashFlows, discountRate, years }: { initialInvestment: number; cashFlows: number; discountRate: number; years: number }) => {
          const npv = cashFlows / ((1 + discountRate / 100) ** years) - initialInvestment;
          return (
            <div className="mt-2">
              <p className="text-gray-700">Net Present Value: {npv.toFixed(2)} $</p>
            </div>
          );
        },
      },
    ],
  };

  const Modal = ({
    isShowModal,
    widget,
    closeModal,
  }: {
    isShowModal: boolean;
    widget: any;
    closeModal: () => void;
  }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [inputs, setInputs] = useState<any>({});
    const [isLoading, setIsLoading] = useState(true);
  
    useEffect(() => {
      if (isShowModal) {
        setIsVisible(true);
      }
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 10000);
      return () => clearTimeout(timer);
    }, [isShowModal]);
  
    const modalCloseHandler = () => {
      setIsVisible(false);
      setTimeout(() => {
        closeModal();
      }, 300);
    };
  
    return isShowModal || isVisible ? (
      <div
        className={`fixed inset-0 bg-[#000000bd] flex justify-center items-center z-50 transition-opacity duration-200 ${isVisible ? "opacity-100" : "opacity-0"}`}
        style={{
          transition: "opacity 0.2s ease-in-out",
        }}
      >
        <div
          className={`bg-white p-10 rounded-lg w-2/3 md:w-1/2 lg:w-1/3 transition-transform duration-500 ease-out ${isVisible ? "transform opacity-100 scale-100 animate__animated animate__fadeIn" : "transform opacity-0 scale-90"}`}
          style={{
            transition: "transform 0.5s ease-out, opacity 0.5s ease-out",
            minHeight: "400px",  // Ensures the modal has a minimum height
          }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-semibold text-gray-800">{widget.label}</h2>
            <button
              onClick={modalCloseHandler}
              className="text-3xl font-semibold cursor-pointer text-gray-600 hover:text-gray-800 transition-colors"
            >
              &times;
            </button>
          </div>

          <p className="text-lg text-gray-700 mb-6">{widget.description}</p>

          <div className="space-y-6">
          {isLoading ? (
            <div className="flex justify-center items-center space-x-4 animate-pulse">
              <ClipLoader size={50} color="#3498db" loading={isLoading} />
              <span className="text-2xl font-semibold text-gray-600">Loading...</span>
            </div>
          ) : (
            widget.widget?.({ ...inputs })
          )}
        </div>
        </div>
      </div>


    ) : null;
  };
  

  return (
    <div className={"flex grow flex-col min-h-dvh " + poppins.className}>
      {/* Sidebar */}
      {isSidebarEnabled && (
        <aside className={`peer fixed bottom-0 top-0 z-30 md:z-20 flex flex-col border-zinc-300/25 bg-white py-6 ltr:border-r rtl:border-l dark:border-zinc-800/50 dark:bg-zinc-900 dark:text-white transition-all duration-300 ease-in-out 
        max-md:w-[20rem] max-md:shadow-2xl ltr:max-md:-left-[20rem] rtl:max-md:-right-[20rem]
        ${isSidebarEnabled ? 'md:w-[20rem] ltr:max-md:left-0 rtl:max-md:right-0' : 'md:w-[6.225em] ltr:max-md:-left-[20rem] rtl:max-md:-right-[20rem]'}
        `}>
          Sidebar
        </aside>
      )}

      {/* Center Content */}
      <div className={`flex flex-auto flex-col transition-all duration-300 ease-in-out 
        ${isSidebarEnabled ? 'ltr:peer-[]:md:pl-[20rem] rtl:peer-[]:md:pr-[20rem]' : 'ltr:peer-[]:md:pl-[6.225em] rtl:peer-[]:md:pr-[6.225em]'}
        `}>

        {/* Header */}
        <header className="sticky top-0 z-10 flex justify-between gap-4 border-b border-zinc-300/25 bg-gray-800 p-6 backdrop-blur-md dark:border-zinc-800/50 dark:bg-zinc-900/75 dark:text-white">
          <div>
            <a href="#"
              onClick={(e) => {
                e.preventDefault()
                setCategory('')
              }}
              className="font-medium my-5 text-[38px] lg:text-[26px] md:text-[26px] sm:text-[26px] xsm:text-[26px] tracking-[0px] text-white">
              SimuHub
            </a>
          </div>
          <div>
            <div className='relative'>
              <div className="relative z-20 max-sm:hidden">
                <div className="absolute top-[2px] bottom-[2px] flex justify-center items-center px-1 rounded start-px">
                  <CiSearch />
                </div>
                <input type="text" className="w-full appearance-none outline-0 text-black dark:text-white disabled:!opacity-25 transition-all duration-300 ease-in-out border-2 border-zinc-100 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800 hover:border-blue-500 dark:hover:border-blue-500 disabled:!border-zinc-500 focus:border-blue-500 dark:focus:border-zinc-800 dark:focus:bg-transparent pl-[32.5px] pr-[44px] py-1.5 text-base rounded-lg min-w-[22rem]" placeholder="Search here..." />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex shrink-0 grow flex-col bg-gradient-to-r from-indigo-50 to-white">
          {!category && (
            <div className="mx-auto p-4 container flex shrink-0 grow basis-auto flex-col pb-0">
              <div className="flex h-full flex-wrap content-start">
                <div className="grid w-full grid-cols-12 gap-6 last:[&>*]:mb-10">
                  {/* Title */}
                  <div className="col-span-12 my-20 text-center">
                    <h1 className="mb-4 text-center text-6xl font-semibold animate-pulse bg-gradient-to-r bg-clip-text text-transparent from-[#1d2939] via-[#3b7eff] to-[#6fad44] hover:from-sky-500 hover:via-violet-500 hover:to-amber-500 transition duration-1000 ease-in-out">
                      Select your app
                    </h1>

                    <div className="text-center text-2xl text-gray-500">
                      Select any app you want to start your simulations with
                    </div>
                  </div>

                  {/* App 1 - Chemistry */}
                  <div className="col-span-12 md:col-span-6 xl:col-span-3">
                    <a href="#" onClick={(e) => {
                      e.preventDefault();
                      setCategory('Chemistry');
                    }}>
                      <div className="flex flex-col bg-gray-100 rounded-xl shadow-lg hover:scale-105 transition-all duration-300 ease-in-out min-h-full">
                        <div className="flex flex-col p-6 flex-grow">
                          <div className="flex items-center gap-6 mb-4">
                            <div className="flex-shrink-0 rounded-full bg-amber-500/25 p-6">
                              <FaFlask className="text-3xl text-amber-600" />
                            </div>
                            <div className="grow">
                              <h2 className="text-2xl font-semibold text-gray-800">Chemistry</h2>
                              <p className="mt-2 text-sm text-gray-600">Explore interactive chemistry models and simulations.</p>
                            </div>
                          </div>
                          <button className="mt-auto self-end bg-amber-500 text-white py-2 px-4 rounded-lg hover:bg-amber-600 transition duration-200 cursor-pointer">
                            Start Learning
                          </button>
                        </div>
                      </div>
                    </a>
                  </div>

                  {/* App 2 - Physics */}
                  <div className="col-span-12 md:col-span-6 xl:col-span-3">
                    <a href="#" onClick={(e) => {
                      e.preventDefault();
                      setCategory('Physics');
                    }}>
                      <div className="flex flex-col bg-blue-50 rounded-xl shadow-lg hover:scale-105 transition-all duration-300 ease-in-out min-h-full">
                        <div className="flex flex-col p-6 flex-grow">
                          <div className="flex items-center gap-6 mb-4">
                            <div className="flex-shrink-0 rounded-full bg-indigo-500/25 p-6">
                              <FaAtom className="text-3xl text-indigo-600" />
                            </div>
                            <div className="grow">
                              <h2 className="text-2xl font-semibold text-gray-800">Physics</h2>
                              <p className="mt-2 text-sm text-gray-600">Dive deep into physics simulations and experiments.</p>
                            </div>
                          </div>
                          <button className="mt-auto self-end bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600 transition duration-200 cursor-pointer">
                            Explore Now
                          </button>
                        </div>
                      </div>
                    </a>
                  </div>

                  {/* App 3 - Finance */}
                  <div className="col-span-12 md:col-span-6 xl:col-span-3">
                    <a href="#" onClick={(e) => {
                      e.preventDefault();
                      setCategory('Finance');
                    }}>
                      <div className="flex flex-col bg-green-50 rounded-xl shadow-lg hover:scale-105 transition-all duration-300 ease-in-out min-h-full">
                        <div className="flex flex-col p-6 flex-grow">
                          <div className="flex items-center gap-6 mb-4">
                            <div className="flex-shrink-0 rounded-full bg-emerald-500/25 p-6">
                              <FaChartLine className="text-3xl text-emerald-600" />
                            </div>
                            <div className="grow">
                              <h2 className="text-2xl font-semibold text-gray-800">Finance</h2>
                              <p className="mt-2 text-sm text-gray-600">Master financial modeling and simulations.</p>
                            </div>
                          </div>
                          <button className="mt-auto self-end bg-emerald-500 text-white py-2 px-4 rounded-lg hover:bg-emerald-600 transition duration-200 cursor-pointer">
                            Start Exploring
                          </button>
                        </div>
                      </div>
                    </a>
                  </div>

                  {/* App 4 - Business Strategies */}
                  <div className="col-span-12 md:col-span-6 xl:col-span-3">
                    <a href="#" onClick={(e) => {
                      e.preventDefault();
                      setCategory('Business Strategies');
                    }}>
                      <div className="flex flex-col bg-purple-50 rounded-xl shadow-lg hover:scale-105 transition-all duration-300 ease-in-out min-h-full">
                        <div className="flex flex-col p-6 flex-grow">
                          <div className="flex items-center gap-6 mb-4">
                            <div className="flex-shrink-0 rounded-full bg-purple-500/25 p-6">
                              <FaBusinessTime className="text-3xl text-purple-600" />
                            </div>
                            <div className="grow">
                              <h2 className="text-2xl font-semibold text-gray-800">Business</h2>
                              <p className="mt-2 text-sm text-gray-600">Learn and implement top business strategies and practices.</p>
                            </div>
                          </div>
                          <button className="mt-auto self-end bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 transition duration-200 cursor-pointer">
                            Get Started
                          </button>
                        </div>
                      </div>
                    </a>
                  </div>

                </div>

              </div>
            </div>
          )}
          {category == 'Chemistry' && (
            <div className="w-full p-8 bg-gradient-to-r from-indigo-50 to-white">
              {/* Title */}
              <div className="mb-16 text-center">
                <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600 dark:text-white leading-tight">
                  Chemistry Simulations
                </h1>
                <button 
                  onClick={() => setCategory('')} 
                  className="mt-4 text-indigo-600 bg-white py-2 px-4 cursor-pointer rounded hover:text-indigo-800 dark:text-indigo-300 dark:hover:text-indigo-500 transition-colors duration-300">
                  Back
                </button>
                <p className="mt-4 text-xl text-gray-500 dark:text-gray-400">
                  Explore and interact with chemical models for a hands-on learning experience.
                </p>
              </div>

              {/* Simulations List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
                {simulations.chemistry.map((sim) => (
                  <div
                    key={sim.id}
                    className="flex flex-col justify-between p-6 bg-gray-800 dark:bg-gray-900 rounded-xl border border-transparent hover:border-indigo-500 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-2xl"
                  >
                    {/* Card Header with Icon */}
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-indigo-600 text-white flex items-center justify-center rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15l9-5-9-5-9 5 9 5z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v6m0 0l-3-3m3 3l3-3"></path>
                        </svg>
                      </div>
                      <h2 className="text-xl font-semibold text-white">{sim.label}</h2>
                    </div>

                    {/* Card Content */}
                    <p className="text-gray-300 text-base mb-4">{sim.description}</p>

                    {/* Card Footer */}
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Happy Simmulating!</span>
                      <button
                        className="px-6 py-2 text-white cursor-pointer bg-indigo-600 hover:bg-indigo-700 rounded-full text-lg font-medium tracking-wide shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
                        onClick={(opn) => {
                          setWidget(sim)
                          openModal()
                        }}
                      >
                        Start
                      </button>
                    </div>
                  </div>
                ))}

              </div>
            </div>
          )}

          {category == 'Physics' && (
            <div className="w-full p-8 bg-gradient-to-r from-indigo-50 to-white">
              {/* Title */}
              <div className="mb-16 text-center">
                <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600 dark:text-white leading-tight">
                  Physics Simulations
                </h1>
                <button 
                  onClick={() => setCategory('')} 
                  className="mt-4 text-indigo-600 bg-white py-2 px-4 cursor-pointer rounded hover:text-indigo-800 dark:text-indigo-300 dark:hover:text-indigo-500 transition-colors duration-300">
                  Back
                </button>
                <p className="mt-4 text-xl text-gray-500 dark:text-gray-400">
                  Explore and interact with chemical models for a hands-on learning experience.
                </p>
              </div>

              {/* Simulations List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
                {simulations.physics.map((sim) => (
                  <div
                    key={sim.id}
                    className="flex flex-col justify-between p-6 bg-gray-800 dark:bg-gray-900 rounded-xl border border-transparent hover:border-indigo-500 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-2xl"
                  >
                    {/* Card Header with Icon */}
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-indigo-600 text-white flex items-center justify-center rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15l9-5-9-5-9 5 9 5z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v6m0 0l-3-3m3 3l3-3"></path>
                        </svg>
                      </div>
                      <h2 className="text-xl font-semibold text-white">{sim.label}</h2>
                    </div>

                    {/* Card Content */}
                    <p className="text-gray-300 text-base mb-4">{sim.description}</p>

                    {/* Card Footer */}
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Happy Simmulating!</span>
                      <button
                        className="px-6 py-2 text-white cursor-pointer bg-indigo-600 hover:bg-indigo-700 rounded-full text-lg font-medium tracking-wide shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
                        onClick={(opn) => {
                          setWidget(sim)
                          openModal()
                        }}
                      >
                        Start
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {category == 'Finance' && (
            <div className="w-full p-8 bg-gradient-to-r from-indigo-50 to-white">
              {/* Title */}
              <div className="mb-16 text-center">
                <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600 dark:text-white leading-tight">
                  Finance Simulations
                </h1>
                <button 
                  onClick={() => setCategory('')} 
                  className="mt-4 text-indigo-600 bg-white py-2 px-4 cursor-pointer rounded hover:text-indigo-800 dark:text-indigo-300 dark:hover:text-indigo-500 transition-colors duration-300">
                  Back
                </button>
                <p className="mt-4 text-xl text-gray-500 dark:text-gray-400">
                  Explore and interact with chemical models for a hands-on learning experience.
                </p>
              </div>

              {/* Simulations List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
                {simulations.finance.map((sim) => (
                  <div
                    key={sim.id}
                    className="flex flex-col justify-between p-6 bg-gray-800 dark:bg-gray-900 rounded-xl border border-transparent hover:border-indigo-500 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-2xl"
                  >
                    {/* Card Header with Icon */}
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-indigo-600 text-white flex items-center justify-center rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15l9-5-9-5-9 5 9 5z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v6m0 0l-3-3m3 3l3-3"></path>
                        </svg>
                      </div>
                      <h2 className="text-xl font-semibold text-white">{sim.label}</h2>
                    </div>

                    {/* Card Content */}
                    <p className="text-gray-300 text-base mb-4">{sim.description}</p>

                    {/* Card Footer */}
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Happy Simmulating!</span>
                      <button
                        className="px-6 py-2 text-white cursor-pointer bg-indigo-600 hover:bg-indigo-700 rounded-full text-lg font-medium tracking-wide shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
                        onClick={(opn) => {
                          setWidget(sim)
                          openModal()
                        }}
                      >
                        Start
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {category == 'Business Strategies' && (
            <div className="w-full p-8 bg-gradient-to-r from-indigo-50 to-white">
              {/* Title */}
              <div className="mb-16 text-center">
                <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600 dark:text-white leading-tight">
                  Business Strategies Simulations
                </h1>
                <button 
                  onClick={() => setCategory('')} 
                  className="mt-4 text-indigo-600 bg-white py-2 px-4 cursor-pointer rounded hover:text-indigo-800 dark:text-indigo-300 dark:hover:text-indigo-500 transition-colors duration-300">
                  Back
                </button>
                <p className="mt-4 text-xl text-gray-500 dark:text-gray-400">
                  Explore and interact with chemical models for a hands-on learning experience.
                </p>
              </div>

              {/* Simulations List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
                {simulations['business-strategies'].map((sim) => (
                  <div
                    key={sim.id}
                    className="flex flex-col justify-between p-6 bg-gray-800 dark:bg-gray-900 rounded-xl border border-transparent hover:border-indigo-500 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-2xl"
                  >
                    {/* Card Header with Icon */}
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-indigo-600 text-white flex items-center justify-center rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15l9-5-9-5-9 5 9 5z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v6m0 0l-3-3m3 3l3-3"></path>
                        </svg>
                      </div>
                      <h2 className="text-xl font-semibold text-white">{sim.label}</h2>
                    </div>

                    {/* Card Content */}
                    <p className="text-gray-300 text-base mb-4">{sim.description}</p>

                    {/* Card Footer */}
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Happy Simmulating!</span>
                      <button
                        className="px-6 py-2 text-white cursor-pointer bg-indigo-600 hover:bg-indigo-700 rounded-full text-lg font-medium tracking-wide shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
                        onClick={(opn) => {
                          setWidget(sim)
                          openModal()
                        }}
                      >
                        Start
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>

        {/* Simulation Modal Conten */}
        <Modal isShowModal={isShowModal} widget={widget} closeModal={() => setIsShowModal(false)} />


        {/* Footer */}
        {/* <footer className="flex justify-between gap-4 p-6 text-sm">

        </footer> */}
      </div>
    </div>
  );
}