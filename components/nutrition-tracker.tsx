"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Apple,
  Plus,
  Search,
  Camera,
  Utensils,
  Target,
  TrendingUp,
  Award,
  Clock,
  Zap,
  Droplets,
  Activity,
  Scale,
  BarChart3
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { toast } from 'sonner';

interface NutritionGoal {
  id: string;
  name: string;
  target: number;
  current: number;
  unit: string;
  color: string;
  category: 'macros' | 'vitamins' | 'minerals';
}

interface FoodItem {
  id: string;
  name: string;
  brand?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  servingSize: string;
  barcode?: string;
}

interface MealEntry {
  id: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foodItem: FoodItem;
  quantity: number;
  timestamp: Date;
}

interface WaterIntake {
  id: string;
  amount: number;
  timestamp: Date;
}

export function NutritionTracker() {
  const [dailyGoals, setDailyGoals] = useState<NutritionGoal[]>([
    { id: 'calories', name: 'Calories', target: 2000, current: 1650, unit: 'kcal', color: '#3b82f6', category: 'macros' },
    { id: 'protein', name: 'Protein', target: 150, current: 120, unit: 'g', color: '#ef4444', category: 'macros' },
    { id: 'carbs', name: 'Carbs', target: 250, current: 180, unit: 'g', color: '#f59e0b', category: 'macros' },
    { id: 'fat', name: 'Fat', target: 65, current: 55, unit: 'g', color: '#10b981', category: 'macros' },
    { id: 'fiber', name: 'Fiber', target: 25, current: 18, unit: 'g', color: '#8b5cf6', category: 'macros' },
    { id: 'water', name: 'Water', target: 2500, current: 1800, unit: 'ml', color: '#06b6d4', category: 'macros' }
  ]);

  const [meals, setMeals] = useState<MealEntry[]>([]);
  const [waterIntake, setWaterIntake] = useState<WaterIntake[]>([]);
  const [isAddingFood, setIsAddingFood] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');
  const [searchQuery, setSearchQuery] = useState('');
  const [foodDatabase] = useState<FoodItem[]>([
    {
      id: '1',
      name: 'Chicken Breast',
      calories: 165,
      protein: 31,
      carbs: 0,
      fat: 3.6,
      fiber: 0,
      sugar: 0,
      sodium: 74,
      servingSize: '100g'
    },
    {
      id: '2',
      name: 'Brown Rice',
      calories: 111,
      protein: 2.6,
      carbs: 23,
      fat: 0.9,
      fiber: 1.8,
      sugar: 0.4,
      sodium: 5,
      servingSize: '100g'
    },
    {
      id: '3',
      name: 'Banana',
      calories: 89,
      protein: 1.1,
      carbs: 23,
      fat: 0.3,
      fiber: 2.6,
      sugar: 12,
      sodium: 1,
      servingSize: '1 medium (118g)'
    },
    {
      id: '4',
      name: 'Greek Yogurt',
      calories: 59,
      protein: 10,
      carbs: 3.6,
      fat: 0.4,
      fiber: 0,
      sugar: 3.6,
      sodium: 36,
      servingSize: '100g'
    },
    {
      id: '5',
      name: 'Almonds',
      calories: 579,
      protein: 21,
      carbs: 22,
      fat: 50,
      fiber: 12,
      sugar: 4.4,
      sodium: 1,
      servingSize: '100g'
    }
  ]);

  const addFoodToMeal = (foodItem: FoodItem, quantity: number) => {
    const mealEntry: MealEntry = {
      id: Date.now().toString(),
      mealType: selectedMealType,
      foodItem,
      quantity,
      timestamp: new Date()
    };

    setMeals(prev => [...prev, mealEntry]);
    
    // Update daily goals
    setDailyGoals(prev => prev.map(goal => {
      const multiplier = quantity / 100; // Assuming base values are per 100g
      switch (goal.id) {
        case 'calories':
          return { ...goal, current: goal.current + (foodItem.calories * multiplier) };
        case 'protein':
          return { ...goal, current: goal.current + (foodItem.protein * multiplier) };
        case 'carbs':
          return { ...goal, current: goal.current + (foodItem.carbs * multiplier) };
        case 'fat':
          return { ...goal, current: goal.current + (foodItem.fat * multiplier) };
        case 'fiber':
          return { ...goal, current: goal.current + (foodItem.fiber * multiplier) };
        default:
          return goal;
      }
    }));

    setIsAddingFood(false);
    toast.success(`Added ${foodItem.name} to ${selectedMealType}`);
  };

  const addWater = (amount: number) => {
    const waterEntry: WaterIntake = {
      id: Date.now().toString(),
      amount,
      timestamp: new Date()
    };

    setWaterIntake(prev => [...prev, waterEntry]);
    
    setDailyGoals(prev => prev.map(goal => 
      goal.id === 'water' 
        ? { ...goal, current: goal.current + amount }
        : goal
    ));

    toast.success(`Added ${amount}ml of water`);
  };

  const getMealsByType = (mealType: string) => {
    return meals.filter(meal => meal.mealType === mealType);
  };

  const getMealCalories = (mealType: string) => {
    return getMealsByType(mealType).reduce((total, meal) => {
      return total + (meal.foodItem.calories * meal.quantity / 100);
    }, 0);
  };

  const macroData = [
    { name: 'Protein', value: dailyGoals.find(g => g.id === 'protein')?.current || 0, color: '#ef4444' },
    { name: 'Carbs', value: dailyGoals.find(g => g.id === 'carbs')?.current || 0, color: '#f59e0b' },
    { name: 'Fat', value: dailyGoals.find(g => g.id === 'fat')?.current || 0, color: '#10b981' }
  ];

  const mealDistribution = [
    { name: 'Breakfast', calories: getMealCalories('breakfast') },
    { name: 'Lunch', calories: getMealCalories('lunch') },
    { name: 'Dinner', calories: getMealCalories('dinner') },
    { name: 'Snacks', calories: getMealCalories('snack') }
  ];

  const filteredFoods = foodDatabase.filter(food =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="glass-effect">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Apple className="w-6 h-6 text-green-600" />
                <span>Nutrition Tracker</span>
              </CardTitle>
              <CardDescription>
                Track your daily nutrition and reach your health goals
              </CardDescription>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="secondary" className="flex items-center space-x-2">
                <Target className="w-4 h-4" />
                <span>{Math.round((dailyGoals.find(g => g.id === 'calories')?.current || 0) / (dailyGoals.find(g => g.id === 'calories')?.target || 1) * 100)}% Daily Goal</span>
              </Badge>
              <Dialog open={isAddingFood} onOpenChange={setIsAddingFood}>
                <DialogTrigger asChild>
                  <Button className="health-gradient">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Food
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add Food to {selectedMealType}</DialogTitle>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Search foods..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1"
                      />
                      <Button variant="outline">
                        <Camera className="w-4 h-4 mr-2" />
                        Scan Barcode
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-2 mb-4">
                      {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map((mealType) => (
                        <Button
                          key={mealType}
                          variant={selectedMealType === mealType ? 'default' : 'outline'}
                          onClick={() => setSelectedMealType(mealType)}
                          className="capitalize"
                        >
                          {mealType}
                        </Button>
                      ))}
                    </div>
                    
                    <div className="max-h-96 overflow-y-auto space-y-2">
                      {filteredFoods.map((food) => (
                        <Card key={food.id} className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium">{food.name}</h3>
                              <p className="text-sm text-slate-600">
                                {food.calories} cal, {food.protein}g protein per {food.servingSize}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Input
                                type="number"
                                placeholder="100"
                                className="w-20"
                                id={`quantity-${food.id}`}
                              />
                              <span className="text-sm">g</span>
                              <Button
                                size="sm"
                                onClick={() => {
                                  const quantityInput = document.getElementById(`quantity-${food.id}`) as HTMLInputElement;
                                  const quantity = parseInt(quantityInput.value) || 100;
                                  addFoodToMeal(food, quantity);
                                }}
                              >
                                Add
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Daily Goals Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dailyGoals.map((goal) => {
          const percentage = Math.min(100, (goal.current / goal.target) * 100);
          const isOverTarget = goal.current > goal.target;
          
          return (
            <Card key={goal.id} className="glass-effect">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: goal.color }}
                      />
                      <span className="font-medium">{goal.name}</span>
                    </div>
                    {goal.id === 'water' && (
                      <Droplets className="w-5 h-5 text-blue-500" />
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold" style={{ color: goal.color }}>
                        {Math.round(goal.current)}{goal.unit}
                      </span>
                      <span className="text-sm text-slate-500">
                        / {goal.target}{goal.unit}
                      </span>
                    </div>
                    
                    <Progress 
                      value={percentage} 
                      className="h-2"
                      style={{ 
                        backgroundColor: isOverTarget ? '#fee2e2' : undefined 
                      }}
                    />
                    
                    <div className="flex items-center justify-between text-xs">
                      <span className={isOverTarget ? 'text-red-600' : 'text-slate-500'}>
                        {Math.round(percentage)}% of goal
                      </span>
                      <span className="text-slate-500">
                        {goal.target - goal.current > 0 ? 
                          `${Math.round(goal.target - goal.current)}${goal.unit} remaining` :
                          `${Math.round(goal.current - goal.target)}${goal.unit} over`
                        }
                      </span>
                    </div>
                  </div>
                  
                  {goal.id === 'water' && (
                    <div className="flex space-x-2">
                      {[250, 500, 750].map((amount) => (
                        <Button
                          key={amount}
                          size="sm"
                          variant="outline"
                          onClick={() => addWater(amount)}
                          className="flex-1"
                        >
                          +{amount}ml
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="today" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="today">Today's Meals</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-4">
          {/* Meal Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map((mealType) => {
              const mealEntries = getMealsByType(mealType);
              const totalCalories = getMealCalories(mealType);
              
              return (
                <Card key={mealType} className="glass-effect">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg capitalize">{mealType}</CardTitle>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedMealType(mealType);
                          setIsAddingFood(true);
                        }}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <CardDescription>
                      {Math.round(totalCalories)} calories
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {mealEntries.length === 0 ? (
                        <p className="text-sm text-slate-500 text-center py-4">
                          No foods added yet
                        </p>
                      ) : (
                        mealEntries.map((meal) => (
                          <div key={meal.id} className="flex items-center justify-between text-sm">
                            <div>
                              <p className="font-medium">{meal.foodItem.name}</p>
                              <p className="text-slate-500">{meal.quantity}g</p>
                            </div>
                            <span className="font-medium">
                              {Math.round(meal.foodItem.calories * meal.quantity / 100)} cal
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Macro Distribution */}
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle>Macronutrient Distribution</CardTitle>
                <CardDescription>Today's macro breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={macroData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${Math.round(value)}g`}
                    >
                      {macroData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Meal Distribution */}
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle>Calorie Distribution</CardTitle>
                <CardDescription>Calories by meal</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={mealDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="calories" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Nutrition Insights */}
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle>Nutrition Insights</CardTitle>
              <CardDescription>AI-powered recommendations based on your intake</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Award className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-800">Great Progress</span>
                  </div>
                  <p className="text-sm text-green-700">
                    You're on track with your protein intake. Keep it up!
                  </p>
                </div>
                
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Target className="w-5 h-5 text-yellow-600" />
                    <span className="font-medium text-yellow-800">Needs Attention</span>
                  </div>
                  <p className="text-sm text-yellow-700">
                    Try to increase your fiber intake with more vegetables and fruits.
                  </p>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Droplets className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-blue-800">Hydration</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    You need 700ml more water to reach your daily goal.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle>Nutrition Goals</CardTitle>
              <CardDescription>Set and track your daily nutrition targets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {dailyGoals.map((goal) => (
                  <div key={goal.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: goal.color }}
                      />
                      <div>
                        <p className="font-medium">{goal.name}</p>
                        <p className="text-sm text-slate-600">
                          Current: {Math.round(goal.current)}{goal.unit} / Target: {goal.target}{goal.unit}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Edit Goal
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle>Nutrition History</CardTitle>
              <CardDescription>Track your nutrition progress over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BarChart3 className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                <p className="text-lg font-medium mb-2">Nutrition History Coming Soon</p>
                <p className="text-slate-600">Track your meals for a few days to see your nutrition trends</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}