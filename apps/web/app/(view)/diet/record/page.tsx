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
import { Icon } from '@repo/shared';

type Step = 'meal-select' | 'search' | 'results' | 'select' | 'list';

// MealType 매핑 (API -> 한글)
const apiToMealType: Record<string, MealType> = {
  'BREAKFAST': '아침',
  'LUNCH': '점심',
  'DINNER': '저녁',
  'SNACK': '간식',
};

// 한글 -> API MealType 매핑
const mealTypeToApi: Record<MealType, string> = {
  '아침': 'BREAKFAST',
  '점심': 'LUNCH',
  '저녁': 'DINNER',
  '간식': 'SNACK',
};

function DietRecordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // URL 파라미터에서 식사 타입과 날짜 가져오기
  const mealTypeParam = searchParams.get('mealType');
  const dateParam = searchParams.get('date') || new Date().toISOString().split('T')[0];
  
  // 식사 선택 화면인지 확인
  const isMealSelection = !mealTypeParam;
  
  // API MealType을 한글로 변환
  const mealType: MealType = mealTypeParam ? (apiToMealType[mealTypeParam] || '아침') : '아침';

  const [step, setStep] = useState<Step>(isMealSelection ? 'meal-select' : 'search');
  const [searchResults, setSearchResults] = useState<Food[]>([]);
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [foodList, setFoodList] = useState<SelectedFood[]>([]);

  const handleMealSelect = (selectedMealType: MealType) => {
    router.push(`/diet/record?mealType=${mealTypeToApi[selectedMealType]}&date=${dateParam}`);
  };

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

  // 식사 선택 화면
  if (step === 'meal-select' || isMealSelection) {
    const mealOptions: Array<{ type: MealType; label: string; icon: string }> = [
      { type: '아침', label: '아침', icon: '/General/breakfast.svg' },
      { type: '점심', label: '점심', icon: '/General/lunch.svg' },
      { type: '저녁', label: '저녁', icon: '/General/dinner.svg' },
      { type: '간식', label: '간식', icon: '/General/snack.svg' },
    ];

    return (
      <div style={{ backgroundColor: '#fff', minHeight: '100vh', paddingTop: 'env(safe-area-inset-top)' }}>
        {/* 헤더 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            borderBottom: '1px solid #f0f0f0',
            position: 'relative',
          }}
        >
          <button
            onClick={() => router.back()}
            style={{
              position: 'absolute',
              left: '16px',
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ←
          </button>
          <h1 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>식단 기록</h1>
        </div>

        {/* 컨텐츠 */}
        <div
          style={{
            padding: '40px 20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 'calc(100vh - 200px)',
          }}
        >
          <h2
            style={{
              fontSize: '18px',
              fontWeight: '700',
              color: '#333',
              marginBottom: '40px',
              textAlign: 'center',
            }}
          >
            어떤 식사를 하셨나요?
          </h2>

          {/* 식사 타입 선택 그리드 */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
              width: '100%',
              maxWidth: '400px',
            }}
          >
            {mealOptions.map((meal) => (
              <button
                key={meal.type}
                onClick={() => handleMealSelect(meal.type)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '32px 20px',
                  backgroundColor: '#fff',
                  border: '1px solid #e5e5e5',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFF5F5';
                  e.currentTarget.style.borderColor = '#FF7878';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#fff';
                  e.currentTarget.style.borderColor = '#e5e5e5';
                }}
              >
                <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon path={meal.icon} width={40} height={40} color="" />
                </div>
                <span
                  style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#333',
                  }}
                >
                  {meal.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

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
          selectedFoods={foodList}
          onSelectFood={handleSelectFood}
          onAddFood={(food) => handleAddFood(food, 1)}
          onRemoveFood={handleRemoveFood}
          onBack={handleBackToSearch}
          onComplete={() => setStep('list')}
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
