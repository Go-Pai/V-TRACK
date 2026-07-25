import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WorkoutSet {
  id: string;
  weight: string;
  reps: string;
  rpe: string;
  isCompleted: boolean;
}

export interface ActiveExercise {
  id: string;
  exerciseId: string;
  name: string;
  sets: WorkoutSet[];
}

interface WorkoutStore {
  workoutName: string;
  activeExercises: ActiveExercise[];
  startTime: Date | null;

  startWorkout: (name: string, exercises: any[]) => void;
  resetWorkout: () => void;
  addSet: (activeExerciseId: string) => void;
  updateSet: (activeExerciseId: string, setId: string, field: keyof WorkoutSet, value: string | boolean) => void;

  // 🌟 2 FITUR BARU KAPTEN 🌟
  removeExercise: (activeExerciseId: string) => void;
  addExtraExercises: (exercises: any[]) => void;
}

export const useWorkoutStore = create<WorkoutStore>()(
  persist(
    (set) => ({
      workoutName: '',
      activeExercises: [],
      startTime: null,

      startWorkout: (name, exercises) => {
        const formattedExercises: ActiveExercise[] = exercises.map((ex) => ({
          id: crypto.randomUUID(),
          exerciseId: ex.id,
          name: ex.name,
          sets: [{ id: crypto.randomUUID(), weight: '', reps: '', rpe: '', isCompleted: false }]
        }));

        set({
          workoutName: name || 'Sesi Latihan',
          activeExercises: formattedExercises,
          startTime: new Date()
        });
      },

      resetWorkout: () => set({ workoutName: '', activeExercises: [], startTime: null }),

      // 🌟 FUNGSI HAPUS GERAKAN
      removeExercise: (activeExerciseId) => set((state) => ({
        activeExercises: state.activeExercises.filter((ex) => ex.id !== activeExerciseId)
      })),

      // 🌟 FUNGSI NAMBAH GERAKAN DI TENGAH SESI
      addExtraExercises: (exercises) => set((state) => {
        const formattedExercises: ActiveExercise[] = exercises.map((ex) => ({
          id: crypto.randomUUID(),
          exerciseId: ex.id,
          name: ex.name,
          sets: [{ id: crypto.randomUUID(), weight: '', reps: '', rpe: '', isCompleted: false }]
        }));
        // Gabungkan gerakan yang lama dengan yang baru ditambah
        return {
          activeExercises: [...state.activeExercises, ...formattedExercises]
        };
      }),

      addSet: (activeExerciseId) => set((state) => ({
        activeExercises: state.activeExercises.map((exercise) => {
          if (exercise.id === activeExerciseId) {
            return {
              ...exercise,
              sets: [
                ...exercise.sets,
                { id: crypto.randomUUID(), weight: '', reps: '', rpe: '', isCompleted: false }
              ]
            };
          }
          return exercise;
        })
      })),

      updateSet: (activeExerciseId, setId, field, value) => set((state) => ({
        activeExercises: state.activeExercises.map((exercise) => {
          if (exercise.id === activeExerciseId) {
            return {
              ...exercise,
              sets: exercise.sets.map((set) => {
                if (set.id === setId) {
                  return { ...set, [field]: value };
                }
                return set;
              })
            };
          }
          return exercise;
        })
      }))
    }),
    {
      name: 'v-track-workout-storage',
    }
  )
);