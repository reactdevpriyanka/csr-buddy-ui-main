import '@testing-library/jest-dom';
import _ from 'lodash';

global._ = _
jest.mock('@/hooks/useEnv');
jest.mock('@/features/useFeature');
