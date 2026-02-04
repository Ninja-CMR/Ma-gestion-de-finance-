import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';

export interface Transaction {
    id: string;
    label: string;
    amount: number;
    category: string;
    date: string;
    type: 'income' | 'expense';
}

export interface Proverb {
    text: string;
    origin: string;
}

export interface Budget {
    id: string;
    category: string;
    limit: number;
    current: number;
    color: string;
    description: string;
}

const STORAGE_KEY_TRANSACTIONS = 'kawaii_finance_transactions';
const STORAGE_KEY_BUDGETS = 'kawaii_finance_budgets';

export const useFinanceStore = defineStore('finance', () => {
    // Initial load from localStorage or fallback to defaults
    const savedTransactions = localStorage.getItem(STORAGE_KEY_TRANSACTIONS);
    const savedBudgets = localStorage.getItem(STORAGE_KEY_BUDGETS);

    const transactions = ref<Transaction[]>(savedTransactions ? JSON.parse(savedTransactions) : [
        {
            id: '1',
            label: 'Bubble Tea',
            amount: 4500,
            category: 'Food',
            date: new Date().toISOString(),
            type: 'expense'
        },
        {
            id: '2',
            label: 'Allocation Mensuelle',
            amount: 325000,
            category: 'Income',
            date: new Date().toISOString(),
            type: 'income'
        },
        {
            id: '3',
            label: 'Loyer',
            amount: 150000,
            category: 'Bills',
            date: new Date().toISOString(),
            type: 'expense'
        }
    ]);

    const budgets = ref<Budget[]>(savedBudgets ? JSON.parse(savedBudgets) : [
        { id: '1', category: 'Alimentation', limit: 100000, current: 4500, color: 'bg-pastel-pink', description: 'Budget pour les courses et restaurants.' },
        { id: '2', category: 'Sorties', limit: 50000, current: 0, color: 'bg-pastel-yellow', description: 'Cinémas, bars et activités de loisirs.' },
        { id: '3', category: 'Transport', limit: 30000, current: 0, color: 'bg-pastel-mint', description: 'Abonnement bus et petits trajets.' },
        { id: '4', category: 'Abonnements', limit: 25000, current: 0, color: 'bg-pastel-blue', description: 'Netflix, Spotify, et autres services.' },
    ]);

    // Watch for changes and persist
    watch(transactions, (newVal) => {
        localStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(newVal));
    }, { deep: true });

    watch(budgets, (newVal) => {
        localStorage.setItem(STORAGE_KEY_BUDGETS, JSON.stringify(newVal));
    }, { deep: true });

    const proverbs = ref<Proverb[]>([
        { text: "Une petite fuite peut couler un grand navire.", origin: "Chinois" },
        { text: "Celui qui achète ce dont il n'a pas besoin vole lui-même.", origin: "Japonais" },
        { text: "Un sou épargné est un sou gagné.", origin: "Européen" },
        { text: "La richesse, c'est comme un arbre : elle commence par une petite graine.", origin: "Africain" },
        { text: "Il ne faut pas manger toutes ses graines sous prétexte qu'on a faim.", origin: "Africain" },
        { text: "L'argent est un bon serviteur mais un mauvais maître.", origin: "Européen" },
        { text: "Le temps, c'est de l'argent.", origin: "Européen" },
        { text: "Si tu veux savoir la valeur de l'argent, essaie d'en emprunter.", origin: "Chinois" }
    ]);

    const proverbOfTheDay = computed(() => {
        const today = new Date().getDate();
        return proverbs.value[today % proverbs.value.length];
    });

    const formatCFA = (val: number) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'XOF', // West African CFA Franc
            minimumFractionDigits: 0,
        }).format(val);
    };

    const totalBalance = computed(() => {
        return transactions.value.reduce((acc, t) => {
            return t.type === 'income' ? acc + t.amount : acc - t.amount;
        }, 0);
    });

    const totalExpenses = computed(() => {
        return transactions.value
            .filter(t => t.type === 'expense')
            .reduce((acc, t) => acc + t.amount, 0);
    });

    const totalIncome = computed(() => {
        return transactions.value
            .filter(t => t.type === 'income')
            .reduce((acc, t) => acc + t.amount, 0);
    });

    const expensesByDate = computed(() => {
        const daily: Record<string, number> = {};
        const monthly: Record<string, number> = {};

        transactions.value.filter(t => t.type === 'expense').forEach(t => {
            const dateObj = new Date(t.date);
            const parts = dateObj.toISOString().split('T');
            if (parts.length > 0) {
                const dayKey = parts[0]!;
                const monthKey = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}`;

                daily[dayKey] = (daily[dayKey] || 0) + t.amount;
                monthly[monthKey] = (monthly[monthKey] || 0) + t.amount;
            }
        });

        return {
            daily: Object.entries(daily).sort().slice(-7) as [string, number][],
            monthly: Object.entries(monthly).sort().slice(-6) as [string, number][]
        };
    });

    const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
        const newT = {
            ...transaction,
            id: crypto.randomUUID()
        };
        transactions.value.unshift(newT);

        // Update budget if applicable
        const budget = budgets.value.find(b => b.category === transaction.category);
        if (budget && transaction.type === 'expense') {
            budget.current += transaction.amount;
        }
    };

    const removeTransaction = (id: string) => {
        const t = transactions.value.find(t => t.id === id);
        if (t && t.type === 'expense') {
            const budget = budgets.value.find(b => b.category === t.category);
            if (budget) budget.current -= t.amount;
        }
        transactions.value = transactions.value.filter(t => t.id !== id);
    };

    const addBudget = (budget: Omit<Budget, 'id' | 'current'>) => {
        budgets.value.push({
            ...budget,
            id: crypto.randomUUID(),
            current: 0
        });
    };

    const updateBudget = (id: string, updates: Partial<Omit<Budget, 'id' | 'current'>>) => {
        const index = budgets.value.findIndex(b => b.id === id);
        if (index !== -1) {
            budgets.value[index] = { ...budgets.value[index]!, ...updates };
        }
    };

    const removeBudget = (id: string) => {
        budgets.value = budgets.value.filter(b => b.id !== id);
    };

    return {
        transactions,
        budgets,
        totalBalance,
        totalExpenses,
        totalIncome,
        proverbOfTheDay,
        expensesByDate,
        formatCFA,
        addTransaction,
        removeTransaction,
        addBudget,
        updateBudget,
        removeBudget
    };
});
