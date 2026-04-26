import { useCallback, useEffect, useReducer } from 'react';
import { CAREERS_STORAGE_KEY, createDefaultWorkbench } from './mockData';
import type {
  AutosaveStatus,
  CareerCity,
  CareerDirectionPlan,
  CareerWorkbench,
  JobDirection,
  LearningMilestone,
  LearningPace,
  ResumeReview,
} from './types';

export type CareerAction =
  | { type: 'replaceWorkbench'; workbench: CareerWorkbench }
  | { type: 'setAutosaveStatus'; status: AutosaveStatus; savedAt?: string }
  | { type: 'setSelectedJob'; jobId: string; direction: JobDirection; city: CareerCity; companyId: string }
  | { type: 'setSelectedDirection'; direction: '全部' | JobDirection }
  | { type: 'setSelectedCity'; city: '全部' | CareerCity }
  | { type: 'setSelectedCompany'; companyId: string }
  | { type: 'setUserSkillLevel'; skillId: string; level: number }
  | { type: 'setResumeDraft'; value: string }
  | { type: 'addResumeReview'; review: ResumeReview }
  | { type: 'setLearningPath'; path: LearningMilestone[] }
  | { type: 'setLearningPace'; pace: LearningPace }
  | { type: 'toggleMilestone'; milestoneId: string }
  | { type: 'toggleFavoriteJob'; jobId: string }
  | { type: 'toggleFavoriteCompany'; companyId: string }
  | { type: 'toggleCompanyCompare'; companyId: string }
  | { type: 'toggleQuestionMastered'; questionId: string }
  | { type: 'toggleQuestionFavorite'; questionId: string }
  | { type: 'setDirectionPlans'; plans: CareerDirectionPlan[] };

function markDirty(workbench: CareerWorkbench): CareerWorkbench {
  return {
    ...workbench,
    autosaveStatus: 'unsaved',
    updatedAt: new Date().toISOString(),
  };
}

function toggleValue(values: string[], value: string): string[] {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

function reducer(workbench: CareerWorkbench, action: CareerAction): CareerWorkbench {
  switch (action.type) {
    case 'replaceWorkbench':
      return action.workbench;
    case 'setAutosaveStatus':
      return {
        ...workbench,
        autosaveStatus: action.status,
        savedAt: action.savedAt ?? workbench.savedAt,
      };
    case 'setSelectedJob':
      return markDirty({
        ...workbench,
        selectedJobId: action.jobId,
        selectedDirection: action.direction,
        selectedCity: action.city,
        selectedCompanyId: action.companyId,
      });
    case 'setSelectedDirection':
      return markDirty({ ...workbench, selectedDirection: action.direction });
    case 'setSelectedCity':
      return markDirty({ ...workbench, selectedCity: action.city });
    case 'setSelectedCompany':
      return markDirty({ ...workbench, selectedCompanyId: action.companyId });
    case 'setUserSkillLevel':
      return markDirty({
        ...workbench,
        userSkills: workbench.userSkills.map((skill) =>
          skill.id === action.skillId ? { ...skill, level: Math.max(0, Math.min(100, action.level)) } : skill,
        ),
      });
    case 'setResumeDraft':
      return markDirty({ ...workbench, resumeDraft: action.value });
    case 'addResumeReview':
      return markDirty({ ...workbench, resumeReviews: [action.review, ...workbench.resumeReviews] });
    case 'setLearningPath': {
      const learningProgress = action.path.reduce<Record<string, boolean>>((acc, item) => {
        acc[item.id] = item.completed;
        return acc;
      }, {});
      return markDirty({ ...workbench, learningPath: action.path, learningProgress });
    }
    case 'setLearningPace':
      return markDirty({ ...workbench, learningPace: action.pace });
    case 'toggleMilestone': {
      const learningPath = workbench.learningPath.map((item) =>
        item.id === action.milestoneId ? { ...item, completed: !item.completed } : item,
      );
      const target = learningPath.find((item) => item.id === action.milestoneId);
      return markDirty({
        ...workbench,
        learningPath,
        learningProgress: target
          ? { ...workbench.learningProgress, [target.id]: target.completed }
          : workbench.learningProgress,
      });
    }
    case 'toggleFavoriteJob':
      return markDirty({ ...workbench, favoriteJobs: toggleValue(workbench.favoriteJobs, action.jobId) });
    case 'toggleFavoriteCompany':
      return markDirty({
        ...workbench,
        favoriteCompanies: toggleValue(workbench.favoriteCompanies, action.companyId),
      });
    case 'toggleCompanyCompare': {
      const comparedCompanyIds = workbench.comparedCompanyIds.includes(action.companyId)
        ? workbench.comparedCompanyIds.filter((id) => id !== action.companyId)
        : [...workbench.comparedCompanyIds, action.companyId].slice(-4);
      return markDirty({ ...workbench, comparedCompanyIds });
    }
    case 'toggleQuestionMastered': {
      const current = workbench.interviewProgress[action.questionId] ?? { mastered: false, favorited: false };
      return markDirty({
        ...workbench,
        interviewProgress: {
          ...workbench.interviewProgress,
          [action.questionId]: { ...current, mastered: !current.mastered },
        },
      });
    }
    case 'toggleQuestionFavorite': {
      const current = workbench.interviewProgress[action.questionId] ?? { mastered: false, favorited: false };
      return markDirty({
        ...workbench,
        interviewProgress: {
          ...workbench.interviewProgress,
          [action.questionId]: { ...current, favorited: !current.favorited },
        },
      });
    }
    case 'setDirectionPlans':
      return markDirty({ ...workbench, directionPlans: action.plans });
    default:
      return workbench;
  }
}

function loadInitialWorkbench(): CareerWorkbench {
  if (typeof window === 'undefined') return createDefaultWorkbench();
  try {
    const raw = window.localStorage.getItem(CAREERS_STORAGE_KEY);
    if (!raw) return createDefaultWorkbench();
    const parsed = JSON.parse(raw) as CareerWorkbench;
    return {
      ...createDefaultWorkbench(),
      ...parsed,
      userSkills: parsed.userSkills ?? createDefaultWorkbench().userSkills,
      learningPath: parsed.learningPath ?? createDefaultWorkbench().learningPath,
      interviewProgress: parsed.interviewProgress ?? {},
      autosaveStatus: 'saved',
    };
  } catch {
    return createDefaultWorkbench();
  }
}

function persistWorkbench(workbench: CareerWorkbench, savedAt: string): void {
  const snapshot: CareerWorkbench = {
    ...workbench,
    savedAt,
    autosaveStatus: 'saved',
  };
  window.localStorage.setItem(CAREERS_STORAGE_KEY, JSON.stringify(snapshot));
}

export function useCareerWorkbench() {
  const [workbench, dispatch] = useReducer(reducer, undefined, loadInitialWorkbench);

  useEffect(() => {
    if (workbench.autosaveStatus !== 'unsaved') return undefined;
    const timer = window.setTimeout(() => {
      dispatch({ type: 'setAutosaveStatus', status: 'saving' });
      window.setTimeout(() => {
        try {
          const savedAt = new Date().toISOString();
          persistWorkbench(workbench, savedAt);
          dispatch({ type: 'setAutosaveStatus', status: 'saved', savedAt });
        } catch {
          dispatch({ type: 'setAutosaveStatus', status: 'error' });
        }
      }, 150);
    }, 700);
    return () => window.clearTimeout(timer);
  }, [workbench]);

  const saveNow = useCallback(() => {
    dispatch({ type: 'setAutosaveStatus', status: 'saving' });
    try {
      const savedAt = new Date().toISOString();
      persistWorkbench(workbench, savedAt);
      dispatch({ type: 'setAutosaveStatus', status: 'saved', savedAt });
      return true;
    } catch {
      dispatch({ type: 'setAutosaveStatus', status: 'error' });
      return false;
    }
  }, [workbench]);

  const resetDemo = useCallback(() => {
    const next = createDefaultWorkbench();
    window.localStorage.setItem(CAREERS_STORAGE_KEY, JSON.stringify(next));
    dispatch({ type: 'replaceWorkbench', workbench: next });
  }, []);

  return { workbench, dispatch, saveNow, resetDemo };
}
