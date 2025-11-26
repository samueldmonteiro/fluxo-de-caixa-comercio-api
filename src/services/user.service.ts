import { inject, injectable } from "tsyringe";
import { UserRepository } from "../repositories/user.repository";
import { MovementRepository } from "../repositories/movement.repository";
import { Decimal } from "@prisma/client/runtime/client";

export interface MovementMetricsResponse {
  period: {
    startDate: Date | null;
    endDate: Date | null;
    totalDays: number;
  };

  totals: {
    income: number;
    outcome: number;
    balance: number;
    movementCount: number;
  };

  daily: {
    date: string;
    income: number;
    outcome: number;
    balance: number;
    movements: {
      id: number;
      type: "INCOME" | "EXPENSE";
      value: number;
      date: Date;
      dateOnly: string;
      userId: number | null;
      categoryId: number | null;
      category: {
        id: number;
        name: string;
        userId: number | null;
      } | null;
      description: string | null;
    }[];
  }[];

  categories: {
    categoryId: number;
    name: string;
    income: number;
    outcome: number;
    movementCount: number;
    percentOfTotalIncome: number;
    percentOfTotalOutcome: number;
  }[];

  insights: {
    biggestIncome: {
      id: number;
      type: "INCOME" | "EXPENSE";
      value: number;
      date: Date;
      dateOnly: string;
      userId: number | null;
      categoryId: number | null;
      category: {
        id: number;
        name: string;
        userId: number | null;
      } | null;
      description: string | null;
    } | null;

    biggestOutcome: {
      id: number;
      type: "INCOME" | "EXPENSE";
      value: number;
      date: Date;
      dateOnly: string;
      userId: number | null;
      categoryId: number | null;
      category: {
        id: number;
        name: string;
        userId: number | null;
      } | null;
      description: string | null;
    } | null;

    avgIncome: number;
    avgOutcome: number;
    avgDailyBalance: number;
    incomeOutcomeRatio: number | null;

    mostActiveDay: {
      date: string;
      income: number;
      outcome: number;
      balance: number;
      movements: {
        id: number;
        type: "INCOME" | "EXPENSE";
        value: number;
        date: Date;
        dateOnly: string;
        userId: number | null;
        categoryId: number | null;
        category: {
          id: number;
          name: string;
          userId: number | null;
        } | null;
        description: string | null;
      }[];
    } | null;

    leastActiveDay: {
      date: string;
      income: number;
      outcome: number;
      balance: number;
      movements: {
        id: number;
        type: "INCOME" | "EXPENSE";
        value: number;
        date: Date;
        dateOnly: string;
        userId: number | null;
        categoryId: number | null;
        category: {
          id: number;
          name: string;
          userId: number | null;
        } | null;
        description: string | null;
      }[];
    } | null;

    categoryCount: number;
  };

  chartData: {
    dailyBalance: { date: string; balance: number }[];
    cumulativeBalance: { date: string; value: number }[];
    incomeVsOutcome: { date: string; income: number; outcome: number }[];
  };
}



@injectable()
export class UserService {

  constructor(
    @inject(UserRepository) private userRepo: UserRepository,
    @inject(MovementRepository) private movementRepo: MovementRepository
  ) { }

  async movementMetrics(
    userId: number,
    params: { startDate?: Date; endDate?: Date }
  ): Promise<MovementMetricsResponse> {
    const movementsResponse = await this.movementRepo.getByUserId({
      userId,
      limit: 0, // sem paginação
      include: { category: true },
      ...(params.startDate && { startDate: params.startDate }),
      ...(params.endDate && { endDate: params.endDate }),
    });

    const rawMovements = movementsResponse.data;

    type NormalizedMovement = {
      id: number;
      type: "INCOME" | "EXPENSE";
      value: number;
      date: Date;
      dateOnly: string;
      userId: number | null;
      categoryId: number | null;
      category: { id: number; name: string; userId: number | null } | null;
      description: string | null;
    };

    // -- Normalização ---------------------------------------------------------
    const movements: NormalizedMovement[] = rawMovements
      .filter(m => m && m.value instanceof Decimal && m.date)
      .map(m => ({
        id: m.id,
        type: m.type,
        value: Number(m.value),
        date: new Date(m.date),
        dateOnly: new Date(m.date).toISOString().split("T")[0],
        userId: m.userId,
        categoryId: m.categoryId,
        category: m.category
          ? { ...m.category, name: m.category.name || "Sem categoria" }
          : null,
        description: m.description ?? null,
      })) as NormalizedMovement[];

    console.log(movements)

    if (!movements[0] || movements.length === 0) {
      // return a fully shaped response following MovementMetricsResponse
      // so TypeScript callers / frontend don't encounter missing fields
      return {
        period: {
          startDate: params.startDate ?? null,
          endDate: params.endDate ?? null,
          totalDays: 0,
        },
        totals: { income: 0, outcome: 0, balance: 0, movementCount: 0 },
        daily: [],
        categories: [],

        insights: {
          biggestIncome: null,
          biggestOutcome: null,
          avgIncome: 0,
          avgOutcome: 0,
          avgDailyBalance: 0,
          incomeOutcomeRatio: null,
          mostActiveDay: null,
          leastActiveDay: null,
          categoryCount: 0,
        },

        chartData: {
          dailyBalance: [],
          cumulativeBalance: [],
          incomeVsOutcome: [],
        },
      };
    }

    // -- Período real ---------------------------------------------------------
    const startDate = params.startDate ?? movements[0].date;
    const endDate = params.endDate ?? movements[movements.length - 1]?.date ?? startDate;

    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / 86400000) + 1;

    // -- Totais ---------------------------------------------------------------
    let income = 0;
    let outcome = 0;

    for (const m of movements) {
      if (m.type === "INCOME") income += m.value;
      else outcome += m.value;
    }

    const balance = income - outcome;

    // -- Agrupamento diário ---------------------------------------------------
    const dailyMap = new Map<
      string,
      { income: number; outcome: number; balance: number; movements: NormalizedMovement[] }
    >();

    for (const m of movements) {
      const key = m.dateOnly;
      if (!key) {
        continue;
      }

      if (!dailyMap.has(key)) {
        dailyMap.set(key, { income: 0, outcome: 0, balance: 0, movements: [] });
      }

      const day = dailyMap.get(key)!;
      day.movements.push(m);

      if (m.type === "INCOME") day.income += m.value;
      else day.outcome += m.value;

      day.balance = day.income - day.outcome;
    }

    const daily = [...dailyMap.entries()]
      .map(([date, d]) => ({ date, ...d }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // -- Categorias -----------------------------------------------------------
    const categoryMap = new Map<
      number,
      {
        categoryId: number;
        name: string;
        income: number;
        outcome: number;
        movementCount: number;
      }
    >();

    for (const m of movements) {
      const id = m.categoryId || 0;
      const name = m.category?.name ?? "Sem categoria";

      if (!categoryMap.has(id)) {
        categoryMap.set(id, {
          categoryId: id,
          name,
          income: 0,
          outcome: 0,
          movementCount: 0,
        });
      }

      const cat = categoryMap.get(id)!;
      cat.movementCount++;
      m.type === "INCOME" ? (cat.income += m.value) : (cat.outcome += m.value);
    }

    const categories = [...categoryMap.values()].map(c => ({
      ...c,
      percentOfTotalIncome: income ? (c.income / income) * 100 : 0,
      percentOfTotalOutcome: outcome ? (c.outcome / outcome) * 100 : 0,
    }));

    // -- Insights avançados ---------------------------------------------------
    const incomeMovs = movements.filter(m => m.type === "INCOME");
    const outcomeMovs = movements.filter(m => m.type === "EXPENSE");

    const biggestIncome =
      incomeMovs.length > 0
        ? ([...incomeMovs].sort((a, b) => b.value - a.value)[0] ?? null)
        : null;

    const biggestOutcome =
      outcomeMovs.length > 0
        ? ([...outcomeMovs].sort((a, b) => b.value - a.value)[0] ?? null)
        : null;

    // dias com maior e menor movimento (financeiro)
    const mostActiveDay = daily.length
      ? ([...daily].sort((a, b) => (b.income + b.outcome) - (a.income + a.outcome))[0] ?? null)
      : null;

    const leastActiveDay = daily.length
      ? ([...daily].sort((a, b) => (a.income + a.outcome) - (b.income + b.outcome))[0] ?? null)
      : null;

    const avgDailyBalance = balance / totalDays;
    const avgIncome = incomeMovs.length ? income / incomeMovs.length : 0;
    const avgOutcome = outcomeMovs.length ? outcome / outcomeMovs.length : 0;

    const incomeOutcomeRatio = outcome > 0 ? income / outcome : null;

    // -- Evolução cumulativa (chart) ------------------------------------------
    const dailyBalance = daily.map(d => ({ date: d.date, balance: d.balance }));

    let cumulative = 0;
    const cumulativeBalance = daily.map(d => {
      cumulative += d.balance;
      return { date: d.date, value: cumulative };
    });

    const incomeVsOutcome = daily.map(d => ({
      date: d.date,
      income: d.income,
      outcome: d.outcome,
    }));

    return {
      period: { startDate, endDate, totalDays },

      totals: {
        income,
        outcome,
        balance,
        movementCount: movements.length,
      },

      daily,
      categories: categories.sort((a, b) =>
        (b.income + b.outcome) - (a.income + a.outcome)
      ),

      insights: {
        biggestIncome,
        biggestOutcome,
        avgIncome,
        avgOutcome,
        avgDailyBalance,
        incomeOutcomeRatio,
        mostActiveDay,
        leastActiveDay,
        categoryCount: categories.length,
      },

      chartData: {
        dailyBalance,
        cumulativeBalance,
        incomeVsOutcome,
      },
    };
  }


}