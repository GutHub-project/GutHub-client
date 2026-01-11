'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';
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

// MealType 매핑 (API -> 한글)
const apiToMealType: Record<string, MealType> = {
  'BREAKFAST': '아침',
  'LUNCH': '점심',
  'DINNER': '저녁',
  'SNACK': '간식',
};

function DietRecordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // URL 파라미터에서 식사 타입과 날짜 가져오기
  const mealTypeParam = searchParams.get('mealType') || 'BREAKFAST';
  const dateParam = searchParams.get('date') || new Date().toISOString().split('T')[0];
  
  // API MealType을 한글로 변환
  const mealType: MealType = apiToMealType[mealTypeParam] || '아침';

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
    // 이미 추가된 음식이면 수량 업데이트
    const existingIndex = foodList.findIndex(f => f.id === food.id);
    if (existingIndex >= 0) {
      setFoodList(prev => prev.map((f, i) => 
        i === existingIndex ? { ...f, amount } : f
      ));
    } else {
      setFoodList((prev) => [...prev, { ...food, amount }]);
    }
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
    <div style={{ backgroundColor: '#fff', minHeight: '100vh', paddingTop: 'env(safe-area-inset-top)' }}>
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
          date={dateParam}
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
