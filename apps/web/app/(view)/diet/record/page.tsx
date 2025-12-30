'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import {
  DietSearch,
  DietSearchResults,
  DietFoodSelect,
  DietList,
  type MealType,
  type SelectedFood,
  type Food,
} from '@repo/diet';

type Step = 'search' | 'results' | 'select' | 'list';

function DietRecordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mealType = (searchParams.get('mealType') || '아침') as MealType;

  const [step, setStep] = useState<Step>('search');
  const [searchResults, setSearchResults] = useState<Food[]>([]);
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [foodList, setFoodList] = useState<SelectedFood[]>([]);

  const handleSearch = (results: Food[]) => {
    setSearchResults(results);
    setStep('results');
  };

  const handleSelectFood = (food: Food) => {
    setSelectedFood(food);
    setStep('select');
  };

  const handleAddFood = (food: Food, amount: number) => {
    setFoodList((prev) => [...prev, { ...food, amount }]);
    setStep('list');
  };

  const handleRemoveFood = (foodId: number) => {
    setFoodList((prev) => prev.filter((f) => f.id !== foodId));
  };

  const handleEditFood = (foodId: number) => {
    const food = foodList.find((f) => f.id === foodId);
    if (food) {
      setSelectedFood(food);
      setStep('select');
    }
  };

  const handleBackToSearch = () => {
    setStep('search');
    setSearchResults([]);
  };

  const handleBackToResults = () => {
    setStep('results');
  };

  const handleComplete = () => {
    router.push('/');
  };

  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh' }}>
      {step === 'search' && (
        <DietSearch
          mealType={mealType}
          onSearch={handleSearch}
          onBack={() => router.back()}
        />
      )}

      {step === 'results' && (
        <DietSearchResults
          results={searchResults}
          onSelectFood={handleSelectFood}
          onBack={handleBackToSearch}
        />
      )}

      {step === 'select' && selectedFood && (
        <DietFoodSelect
          food={selectedFood}
          initialAmount={foodList.find(f => f.id === selectedFood.id)?.amount}
          onAdd={handleAddFood}
          onBack={handleBackToResults}
        />
      )}

      {step === 'list' && (
        <DietList
          mealType={mealType}
          foods={foodList}
          onEdit={handleEditFood}
          onRemove={handleRemoveFood}
          onComplete={handleComplete}
          onBack={handleBackToSearch}
        />
      )}
    </div>
  );
}

export default function DietRecordPage() {
  return (
    <Suspense fallback={
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '16px',
        color: '#666'
      }}>
        로딩 중...
      </div>
    }>
      <DietRecordContent />
    </Suspense>
  );
}
