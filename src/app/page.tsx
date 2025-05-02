"use client"

import { Lato } from "next/font/google";
import { FaAtom, FaBusinessTime, FaChartLine, FaFlask } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import { BeatLoader, PropagateLoader } from "react-spinners";
import { IoIosArrowRoundBack } from "react-icons/io";
import { IoCloseCircle } from "react-icons/io5";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { AnimatePresence, motion } from "motion/react"
import debounce from "lodash.debounce";
import { GiSoundOff, GiSoundOn } from "react-icons/gi";
import Select from 'react-select';

const lato = Lato({
  display: 'swap',
  fallback: ['Arial', 'open-sans'],
  preload: false,
  style: ['normal', 'italic'],
  weight: ['100', '300', '400', '700', '900'],
  subsets: ['latin', "latin-ext"],
});


const simulations = {
  Science: [
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

  decisionTrees: [
    {
      id: 'binary-tree-depth',
      label: 'Binary Tree Maximum Depth',
      description: 'Calculate the maximum depth (or height) of a binary tree based on the number of nodes.',
      inputs: [
        { id: 'nodes', label: 'Number of Nodes', type: 'number', defaultValue: 15 },
      ],
      widget: ({ nodes }: { nodes: number }) => {
        const depth = nodes > 0 ? Math.floor(Math.log2(nodes)) + 1 : 0;
        return (
          <div className="mt-2">
            <p className="text-gray-700">
              Maximum Depth: {depth} levels
            </p>
          </div>
        );
      },
    },
    {
      id: 'binary-search-tree-check',
      label: 'Binary Search Tree (BST) Validation',
      description: 'Check if a given list of node values can represent a valid Binary Search Tree (BST) preorder traversal.',
      inputs: [
        { id: 'values', label: 'Node Values (comma-separated)', type: 'text', defaultValue: '8,5,1,7,10,12' },
      ],
      widget: ({ values }: { values: string }) => {
        const arr = values.split(',').map(Number);
        const stack: number[] = [];
        let root = -Infinity;
        let isValid = true;

        for (const value of arr) {
          if (value < root) {
            isValid = false;
            break;
          }
          while (stack.length && value > stack[stack.length - 1]) {
            root = stack.pop()!;
          }
          stack.push(value);
        }

        return (
          <div className="mt-2">
            <p className="text-gray-700">
              {isValid ? 'Valid BST Preorder' : 'Invalid BST Preorder'}
            </p>
          </div>
        );
      },
    },
    {
      id: 'tree-node-count',
      label: 'Count Nodes in Complete Binary Tree',
      description: 'Estimate the total number of nodes in a complete binary tree given its height.',
      inputs: [
        { id: 'height', label: 'Tree Height', type: 'number', defaultValue: 4 },
      ],
      widget: ({ height }: { height: number }) => {
        const nodeCount = (2 ** height) - 1;
        return (
          <div className="mt-2">
            <p className="text-gray-700">
              Total Nodes: {nodeCount}
            </p>
          </div>
        );
      },
    },
    {
      id: 'tree-traversal-steps',
      label: 'Tree Traversal Steps Estimator',
      description: 'Estimate the number of steps (visits) needed to traverse an entire tree (like DFS or BFS).',
      inputs: [
        { id: 'nodes', label: 'Number of Nodes', type: 'number', defaultValue: 20 },
      ],
      widget: ({ nodes }: { nodes: number }) => {
        const steps = nodes > 0 ? (2 * nodes - 1) : 0;
        return (
          <div className="mt-2">
            <p className="text-gray-700">
              Approximate Traversal Steps: {steps}
            </p>
          </div>
        );
      },
    },
    {
      id: 'balanced-tree-check',
      label: 'Balanced Tree Height Check',
      description: 'Estimate whether a tree with given nodes could form a balanced binary tree.',
      inputs: [
        { id: 'nodes', label: 'Number of Nodes', type: 'number', defaultValue: 10 },
      ],
      widget: ({ nodes }: { nodes: number }) => {
        const minHeight = Math.floor(Math.log2(nodes)) + 1;
        const maxHeight = nodes;
        return (
          <div className="mt-2">
            <p className="text-gray-700">
              Minimum Possible Height (Balanced): {minHeight} <br />
              Maximum Possible Height (Unbalanced): {maxHeight}
            </p>
          </div>
        );
      },
    },
    {
      id: 'minimum-tree-height',
      label: 'Minimum Height for Given Nodes',
      description: 'Find the minimum height a binary tree would need to store a certain number of nodes.',
      inputs: [
        { id: 'nodes', label: 'Number of Nodes', type: 'number', defaultValue: 50 },
      ],
      widget: ({ nodes }: { nodes: number }) => {
        const minHeight = Math.ceil(Math.log2(nodes + 1));
        return (
          <div className="mt-2">
            <p className="text-gray-700">
              Minimum Tree Height: {minHeight} levels
            </p>
          </div>
        );
      },
    },
  ]

};

const categoriesHome = {
  Science: {
    title: 'Science',
    icon: <FaFlask />,
    cardBg: 'bg-white/10 backdrop-blur-lg border border-white/10',
    iconBg: 'bg-sky-500/30',
    iconColor: 'text-sky-300',
    buttonColor: 'bg-sky-500 hover:bg-sky-600',
    description: 'Explore interactive Science models and simulations.',
    buttonText: 'Start Learning',
  },
  Physics: {
    title: 'Physics',
    icon: <FaAtom />,
    cardBg: 'bg-white/10 backdrop-blur-lg border border-white/10',
    iconBg: 'bg-indigo-500/30',
    iconColor: 'text-indigo-300',
    buttonColor: 'bg-indigo-500 hover:bg-indigo-600',
    description: 'Dive deep into physics simulations and experiments.',
    buttonText: 'Explore Now',
  },
  DecisionTrees: {
    title: 'Decision Trees',
    icon: <FaBusinessTime />,
    cardBg: 'bg-white/10 backdrop-blur-lg border border-white/10',
    iconBg: 'bg-violet-500/30',
    iconColor: 'text-violet-300',
    buttonColor: 'bg-violet-500 hover:bg-violet-600',
    description: 'Learn and visualize complex data structures and algorithms.',
    buttonText: 'Get Started',
  },
  Finance: {
    title: 'Finance',
    icon: <FaChartLine />,
    cardBg: 'bg-white/10 backdrop-blur-lg border border-white/10',
    iconBg: 'bg-teal-500/30',
    iconColor: 'text-teal-300',
    buttonColor: 'bg-teal-500 hover:bg-teal-600',
    description: 'Master financial modeling and simulations.',
    buttonText: 'Start Exploring',
  },
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
  const [outcomeLoader, setOutcomeLoader] = useState(true);
  const [isAudioUnmute, setIsAudioUnmute] = useState<boolean>(true);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(true);


  // Create a new audio element
  const audio = new Audio('https://cdn.pixabay.com/download/audio/2023/08/26/audio_a6ee15a317.mp3?filename=sunflower-street-drumloop-85bpm-163900.mp3');

  const audio2 = new Audio('https://cdn.pixabay.com/download/audio/2025/03/18/audio_959e630af0.mp3?filename=santur-guitar-melody-with-delay-315261.mp3');

  useEffect(() => {
    if (isShowModal) {
      document.body.classList.add('overflow-hidden');
      setIsVisible(true);
    }
    const timer = setTimeout(() => {
      setIsLoading(false);

      setTimeout(() => {
        setOutcomeLoader(false);
      }, 1000);
    }, 10000);

    return () => {
      clearTimeout(timer)
      document.body.classList.remove('overflow-hidden');

    };
  }, [isShowModal]);

  useEffect(() => {
    if (!isShowModal) return;

    audio.muted = !isAudioUnmute;
    audio2.muted = !isAudioUnmute;

    if (outcomeLoader && audio.paused) {
      audio.play();
    } else if (!outcomeLoader && audio2.paused) {
      audio2.play();
    }

    const timer = setTimeout(() => {
      if (outcomeLoader) {
        setIsLoading(false);
        if(!audio.paused) audio.pause();

        setTimeout(() => {
          setOutcomeLoader(false);
          audio2.play();
        }, 1000);
      }
    }, 8000);

    return () => {
      clearTimeout(timer);
      audio.pause();
      audio2.pause();
    };
  }, [isAudioUnmute, isShowModal, outcomeLoader]);


  useEffect(() => {
    setInputs(
      widget.inputs?.reduce((acc: any, input: any) => {
        acc[input.id] = input.defaultValue || "";
        return acc;
      }, {}) || {}
    );
  }, [widget])

  const modalCloseHandler = () => {
    audio2.pause();
    confirmAlert({
      title: 'Are you sure?',
      message: 'Any progress made will be lost.',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            setInputs({});
            setIsVisible(false);
            closeModal();
            setIsLoading(true);
            setOutcomeLoader(true);
          }
        },
        {
          label: 'No',
          onClick: () => {
          }
        }
      ],
      overlayClassName: 'modal-overlay',
    });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        modalCloseHandler();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [modalCloseHandler]);

  const handleInputChange = (id: string, value: any) => {
    setInputs((prev: any) => ({
      ...prev,
      [id]: value,
    }));
    setOutcomeLoader(true);
    (debounce(() => {
      setTimeout(() => {
        setOutcomeLoader(false)
      }, 1000)
    }, 2000))();
  };

  return isShowModal || isVisible ? (
    <div
      className={`fixed inset-0 flex justify-center items-center z-50 transition-opacity duration-200 modal-overlay ${isVisible ? "opacity-100" : "opacity-0"}`}
      style={{
        transition: "opacity 1s ease-in-out",
      }}
    >
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={() => setIsAudioUnmute(!isAudioUnmute)}
          className="text-white bg-black/30 hover:bg-black/50 p-2 rounded-full transition duration-300"
          title="Mute Audio"
        >
          {isAudioUnmute ? (
            <GiSoundOn className="text-xl" />
          ) : (
            <GiSoundOff className="text-xl" />
          )}
        </button>
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 1,
          scale: { type: "spring", visualDuration: 1, bounce: 0.5 },
        }}
        className="relative bg-white/10 backdrop-blur-lg p-8 rounded-lg w-11/12 md:w-2/3 lg:w-1/2 xl:w-1/2 max-h-[90vh] overflow-y-auto"
        style={{
          minHeight: '600px',
        }}
      >

        {/* Close Button */}
        <button
          onClick={modalCloseHandler}
          className="absolute top-4 right-4 cursor-pointer text-4xl text-white/80 hover:text-white focus:outline-none transition-colors duration-200"
        >
          <IoCloseCircle />
        </button>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-4xl font-extrabold text-sky-200 leading-tight tracking-tight">{widget.label}</h2>
        </div>

        <p className="text-lg text-white/80 font-medium mb-6">{widget.description}</p>

        {!isLoading ? (
          <>
            {/* Dynamic Form Inputs */}
            <div className="space-y-6 mb-6">
              {widget.inputs?.map((input: any) => (
                <div key={input.id}>
                  <label className="block text-sm font-medium text-white/80 mb-2">{input.label}</label>
                  <input
                    type={input.type}
                    value={inputs[input.id]}
                    onChange={(e) => handleInputChange(input.id, input.type === 'number' ? +e.target.value : e.target.value)}
                    className="w-full bg-black/20 text-white/80 text-sm rounded px-4 py-3 border border-black/10 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#10152f] focus:border-[#10152f] hover:ring-[0.5px] hover:ring-[#10152f] transition duration-300"
                    placeholder={`Enter ${input.label}`}
                  />
                </div>
              ))}
            </div>

            {outcomeLoader ? (
              <div className="relative flex justify-center py-10">
                <PropagateLoader />
              </div>
            ) : null}
            {!outcomeLoader && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.6,
                  scale: { type: "spring", visualDuration: 0.5, bounce: 0.7 },
                }}
                className="py-4 px-4 rounded-xl border border-black/10 bg-[#e8faff] font-semibold"
              >
                <p className="text-xl font-extrabold text-black">Outcome:</p>
                {widget.widget?.({ ...inputs })}
              </motion.div>
            )}
          </>
        ) : (
          <div className="flex justify-center items-center mt-12 space-x-4 animate-pulse">
            <BeatLoader speedMultiplier={0.4} color="#000" loading={isLoading} />
          </div>
        )}
      </motion.div>


    </div>
  ) : null;

};

export default function Home() {
  const isSidebarEnabled = false;
  const [category, setCategory] = useState<string>('');
  const categorySelect = Object.entries(categoriesHome).map(item => {
    return {
      value: item[0],
      label: item[1].title
    }
  });

  const [isShowModal, setIsShowModal] = useState(false)
  const [widget, setWidget] = useState({})

  const openModal = () => {
    setIsShowModal(true);
  };
  const [isVisible, setIsVisible] = useState(true);
  const [SelectComponent, setSelectComponent] = useState<any>(null);

  useEffect(() => {
    import('react-select').then((mod) => {
      setSelectComponent(() => mod.default);
    });
  }, []);

  if (!SelectComponent) return null;

  return (
    <div className={"flex grow flex-col min-h-dvh " + lato.className}>
      <style>
        {`
          body,.modal-overlay {
            background: linear-gradient(135deg, #3c67c1, #99c2e2);
          }
          button{
            cursor:pointer;
          }
        `}
      </style>
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
      <div className={`flex flex-auto flex-col z-1 pb-20 to-white transition-all duration-300 ease-in-out 
        ${isSidebarEnabled ? 'ltr:peer-[]:md:pl-[20rem] rtl:peer-[]:md:pr-[20rem]' : 'ltr:peer-[]:md:pl-[6.225em] rtl:peer-[]:md:pr-[6.225em]'}
        `}>

        {/* Header */}
        <header className="sticky top-0 z-10 flex justify-between gap-4 border-b border-zinc-300/25 bg-transparent p-6 backdrop-blur-md dark:border-zinc-800/50 dark:bg-zinc-900/75 dark:text-white">
          <div>
            <a href="#"
              onClick={(e) => {
                e.preventDefault()
                setCategory('')
              }}
              className="font-extrabold my-5 text-[38px] lg:text-[26px] md:text-[26px] sm:text-[26px] xsm:text-[26px] tracking-[0px] text-white ">
              SimuHub
            </a>
          </div>
          <div>
            <div className="">
              <div className="relative z-20 max-sm:hidden">
                <SelectComponent
                  className="text-sm shadow-sm w-[200px]"
                  classNamePrefix="react-select"
                  styles={{
                    control: (base: React.CSSProperties) => ({
                      ...base,
                      backgroundColor: 'rgba(255, 255, 255, 0.85)',
                      borderRadius: '0.5rem',
                      borderColor: '#D1D5DB',
                      padding: '2px 4px',
                      boxShadow: 'none',
                      color: '#1F2937', // dark gray text
                      '&:hover': { borderColor: '#6366F1' },
                    }),
                    menu: (base: React.CSSProperties) => ({
                      ...base,
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      borderRadius: '0.5rem',
                      marginTop: 4,
                      zIndex: 10,
                    }),
                    option: (base: React.CSSProperties, state: any) => ({
                      ...base,
                      backgroundColor: state.isSelected
                        ? '#6366F1'
                        : state.isFocused
                          ? '#E0E7FF'
                          : 'transparent',
                      color: state.isSelected ? '#fff' : '#1F2937',
                      cursor: 'pointer',
                    }),
                    placeholder: (base: React.CSSProperties) => ({
                      ...base,
                      color: '#6B7280',
                    }),
                    singleValue: (base: React.CSSProperties) => ({
                      ...base,
                      color: '#1F2937',
                    }),
                  }}
                  placeholder="Select a category"
                  value={categorySelect.find(option => option.value === category) || null}
                  onChange={(selectedOption: { value: string }) =>
                    setCategory(selectedOption ? selectedOption.value : '')
                  }
                  options={categorySelect}
                  isClearable={true}
                />
              </div>
            </div>

          </div>
        </header>

        {/* Main Content */}
        <main className="flex shrink-0 grow flex-col">
          {!category && (
            <div className="mx-auto p-4 container flex shrink-0 grow basis-auto flex-col pb-0">
              <div className="flex h-full flex-wrap content-start">
                <div className="grid w-full grid-cols-12 gap-6 last:[&>*]:mb-10">
                  {/* Title */}
                  <div className="col-span-12 my-20 text-center">
                    <h1 className="mb-4 text-center text-5xl md:text-6xl font-extrabold uppercase tracking-tight bg-gradient-to-r bg-clip-text text-transparent from-lime-200 via-teal-200 to-cyan-200 hover:from-teal-300 hover:via-sky-300 hover:to-blue-300 transition duration-300 ease-in-out drop-shadow-md">
                      Let's Get Started!
                    </h1>
                    <div className="text-center text-sm md:text-base text-white tracking-widest uppercase drop-shadow-sm">
                      Pick any app to dive into simulations
                    </div>
                  </div>

                  {Object.entries(categoriesHome).map(([key, category]) => (
                    <div key={key} className="col-span-12 md:col-span-6 xl:col-span-3">
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCategory(key);
                        }}
                      >
                        <div className="flex flex-col bg-white/10 backdrop-blur-md rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-transform duration-300 ease-in-out min-h-full border border-white/25">
                          <div className="flex flex-col p-6 flex-grow">
                            <div className="flex items-center gap-6 mb-5">
                              <div className={`flex-shrink-0 rounded-full ${category.iconBg} p-4`}>
                                {React.cloneElement(category.icon, { className: `text-3xl ${category.iconColor}` })}
                              </div>
                              <div className="grow">
                                <h2 className="text-2xl font-medium text-white leading-tight">{category.title}</h2>
                                <p className="mt-2 text-sm text-gray-200">{category.description}</p>
                              </div>
                            </div>
                            <button
                              className={`mt-auto self-end py-2 px-5 rounded-full text-sm font-bold text-white ${category.buttonColor} hover:bg-opacity-90 transition-all ease-in-out`}
                            >
                              {category.buttonText}
                            </button>
                          </div>
                        </div>
                      </a>
                    </div>
                  ))}

                </div>

              </div>
            </div>
          )}

          {category == 'Science' && (
            <AnimatePresence>
              {isVisible && (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, x: 1200 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -1200 }}
                  transition={{
                    duration: 0.2,
                    ease: "easeInOut",
                  }}
                  className="w-full p-8"
                >
                  {/* Title */}
                  <div className="mb-16 text-center">
                    <div className="flex flex-col items-center text-center gap-6">
                      <div className="flex items-center gap-6">
                        <IoIosArrowRoundBack
                          onClick={() => {
                            setIsVisible(false);
                            setTimeout(() => {
                              setCategory('');
                              setIsVisible(true);
                            }, 200);
                          }}
                          className="cursor-pointer text-6xl text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.4)] transition-transform duration-300 hover:scale-125"
                        />
                        <h1 className="text-5xl md:text-6xl font-extrabold tracking-wide text-sky-200">
                          Science Simulations
                        </h1>
                      </div>
                      <p className="text-lg md:text-xl text-white/80 leading-relaxed max-w-2xl">
                        Explore and interact with dynamic scientific models for an engaging, hands-on learning experience.
                      </p>
                    </div>
                  </div>
                  {/* Simulations List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-12">
                    {simulations.Science?.map((sim) => (
                      <div
                        key={sim.id}
                        className="flex flex-col justify-between p-6 bg-white/10 backdrop-blur-lg rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-105"
                      >
                        {/* Card Header with Icon */}
                        <div className="flex items-center space-x-4 mb-4">
                          <div className={`w-12 h-12 text-white flex items-center justify-center rounded-full ${categoriesHome[category].iconBg}`}>
                            {React.cloneElement(categoriesHome[category].icon, { className: `w-6 h-6 ${categoriesHome[category].iconColor}` })}
                          </div>
                          <h2 className="text-xl font-semibold text-sky-300">{sim.label}</h2>
                        </div>

                        {/* Card Content */}
                        <p className="text-gray-200 text-base mb-4">{sim.description}</p>

                        {/* Card Footer */}
                        <div className="flex justify-end items-center">
                          <button
                            className={`px-6 py-2 text-white cursor-pointer ${categoriesHome[category].buttonColor} rounded-full text-lg font-medium tracking-wide shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105`}
                            onClick={() => {
                              setWidget(sim);
                              openModal();
                            }}
                          >
                            Start
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}

          {category == 'Physics' && (
            <AnimatePresence>
              {isVisible && (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, x: 1200 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -1200 }}
                  transition={{
                    duration: 0.2,
                    ease: "easeInOut",
                  }}
                  className="w-full p-8"
                >
                  {/* Title */}
                  <div className="mb-16 text-center">
                    <div className="flex flex-col items-center text-center gap-6">
                      <div className="flex items-center gap-6">
                        <IoIosArrowRoundBack
                          onClick={() => {
                            setIsVisible(false);
                            setTimeout(() => {
                              setCategory('');
                              setIsVisible(true);
                            }, 200);
                          }}
                          className="cursor-pointer text-6xl text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.4)] transition-transform duration-300 hover:scale-125"
                        />
                        <h1 className="text-5xl md:text-6xl font-extrabold tracking-wide text-indigo-600">
                          Physics Simulations
                        </h1>
                      </div>
                      <p className="text-lg md:text-xl text-white/80 leading-relaxed max-w-2xl">
                        Explore and interact with physical phenomena for a hands-on learning experience.
                      </p>
                    </div>
                  </div>
                  {/* Simulations List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-12">
                    {simulations.physics?.map((sim) => (
                      <div
                        key={sim.id}
                        className="flex flex-col justify-between p-6 bg-white/10 backdrop-blur-lg rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-105"
                      >
                        {/* Card Header with Icon */}
                        <div className="flex items-center space-x-4 mb-4">
                          <div className={`w-12 h-12 text-white flex items-center justify-center rounded-full ${categoriesHome[category].iconBg}`}>
                            {React.cloneElement(categoriesHome[category].icon, { className: `w-6 h-6 ${categoriesHome[category].iconColor}` })}
                          </div>
                          <h2 className="text-xl font-semibold text-sky-300">{sim.label}</h2>
                        </div>

                        {/* Card Content */}
                        <p className="text-gray-200 text-base mb-4">{sim.description}</p>

                        {/* Card Footer */}
                        <div className="flex justify-end items-center">
                          <button
                            className={`px-6 py-2 text-white cursor-pointer ${categoriesHome[category].buttonColor} rounded-full text-lg font-medium tracking-wide shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105`}
                            onClick={() => {
                              setWidget(sim);
                              openModal();
                            }}
                          >
                            Start
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}

          {category == 'Finance' && (
            <AnimatePresence>
              {isVisible && (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, x: 1200 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -1200 }}
                  transition={{
                    duration: 0.2,
                    ease: "easeInOut",
                  }}
                  className="w-full p-8">
                  {/* Title */}
                  <div className="mb-16 text-center">
                    <div className="flex flex-col items-center text-center gap-6">
                      <div className="flex items-center gap-6">
                        <IoIosArrowRoundBack
                          onClick={() => {
                            setIsVisible(false);
                            setTimeout(() => {
                              setCategory('');
                              setIsVisible(true);
                            }, 200);
                          }}
                          className="cursor-pointer text-6xl text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.4)] transition-transform duration-300 hover:scale-125"
                        />
                        <h1 className="text-5xl md:text-6xl font-extrabold tracking-wide text-emerald-400">
                          Finance Simulations
                        </h1>
                      </div>
                      <p className="text-lg md:text-xl text-white/80 leading-relaxed max-w-2xl">
                        Explore and interact with financial models for a hands-on learning experience.
                      </p>
                    </div>
                  </div>
                  {/* Simulations List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-12">
                    {simulations.finance?.map((sim) => (
                      <div
                        key={sim.id}
                        className="flex flex-col justify-between p-6 bg-white/10 backdrop-blur-lg rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-105"
                      >
                        {/* Card Header with Icon */}
                        <div className="flex items-center space-x-4 mb-4">
                          <div className={`w-12 h-12 text-white flex items-center justify-center rounded-full ${categoriesHome[category].iconBg}`}>
                            {React.cloneElement(categoriesHome[category].icon, { className: `w-6 h-6 ${categoriesHome[category].iconColor}` })}
                          </div>
                          <h2 className="text-xl font-semibold text-sky-300">{sim.label}</h2>
                        </div>

                        {/* Card Content */}
                        <p className="text-gray-200 text-base mb-4">{sim.description}</p>

                        {/* Card Footer */}
                        <div className="flex justify-end items-center">
                          <button
                            className={`px-6 py-2 text-white cursor-pointer ${categoriesHome[category].buttonColor} rounded-full text-lg font-medium tracking-wide shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105`}
                            onClick={() => {
                              setWidget(sim);
                              openModal();
                            }}
                          >
                            Start
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}

          {category === 'DecisionTrees' && (
            <AnimatePresence>
              {isVisible && (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, x: 1200 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -1200 }}
                  transition={{
                    duration: 0.2,
                    ease: "easeInOut",
                  }}
                  className="w-full p-8"
                >
                  {/* Title */}
                  <div className="mb-16 text-center">
                    <div className="flex flex-col items-center text-center gap-6">
                      <div className="flex items-center gap-6">
                        <IoIosArrowRoundBack
                          onClick={() => {
                            setIsVisible(false);
                            setTimeout(() => {
                              setCategory('');
                              setIsVisible(true);
                            }, 200);
                          }}
                          className="cursor-pointer text-6xl text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.4)] transition-transform duration-300 hover:scale-125"
                        />
                        <h1 className="text-5xl md:text-6xl font-extrabold tracking-wide text-purple-400">
                          Decision Trees Simulations
                        </h1>
                      </div>
                      <p className="text-lg md:text-xl text-white/80 leading-relaxed max-w-2xl">
                        Explore and interact with business models for a hands-on learning experience.
                      </p>
                    </div>

                  </div>

                  {/* Simulations List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-12">
                    {simulations.decisionTrees?.map((sim) => (
                      <div
                        key={sim.id}
                        className="flex flex-col justify-between p-6 bg-white/10 backdrop-blur-lg rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-105"
                      >
                        {/* Card Header with Icon */}
                        <div className="flex items-center space-x-4 mb-4">
                          <div className={`w-12 h-12 text-white flex items-center justify-center rounded-full ${categoriesHome[category].iconBg}`}>
                            {React.cloneElement(categoriesHome[category].icon, { className: `w-6 h-6 ${categoriesHome[category].iconColor}` })}
                          </div>
                          <h2 className="text-xl font-semibold text-sky-300">{sim.label}</h2>
                        </div>

                        {/* Card Content */}
                        <p className="text-gray-200 text-base mb-4">{sim.description}</p>

                        {/* Card Footer */}
                        <div className="flex justify-end items-center">
                          <button
                            className={`px-6 py-2 text-white cursor-pointer ${categoriesHome[category].buttonColor} rounded-full text-lg font-medium tracking-wide shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105`}
                            onClick={() => {
                              setWidget(sim);
                              openModal();
                            }}
                          >
                            Start
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </main>


        {/* Simulation Modal Conten */}
        {isShowModal && (
          <Modal isShowModal={isShowModal} widget={widget} closeModal={() => setIsShowModal(false)} />
        )}

      </div>
      {/* Footer */}
      <footer className="flex justify-center items-center gap-4 p-6 bg-black/50 backdrop-blur-md rounded-t-xl border-t border-white/20">
        <p className="text-sm text-gray-300">
          © 2025 <span className="font-semibold">SimuHub</span>. All rights reserved.
        </p>
        <div className="text-sm text-gray-400">
          <a href="/#" className="hover:text-sky-300 transition-colors duration-300">Privacy Policy</a> |
          <a href="/#" className="hover:text-sky-300 transition-colors duration-300"> Terms of Service</a>
        </div>
      </footer>

    </div>
  );
}