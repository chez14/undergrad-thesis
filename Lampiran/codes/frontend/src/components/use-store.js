import React from 'react';
import { MobXProviderContext } from 'mobx-react'

// eslint-disable-next-line
import AdminStore from '~/store/adminStore';
// eslint-disable-next-line
import ExamStore from '~/store/examStore';
// eslint-disable-next-line
import EntityStore from '~/store/entityStore';

function useStores() {
  return React.useContext(MobXProviderContext)
}

export default useStores;

/**
 * Use Exam Store
 * @return {ExamStore} exam store
 */
export function useExamStore() {
  const { examStore } = useStores();
  return examStore;
}

/**
 * Use AdminStore
 * @return {AdminStore} admin store
 */
export function useAdminStore() {
  const { adminStore } = useStores();
  return adminStore;
}

/**
 * Use EntityStore
 * @return {EntityStore} entity store
 */
export function useEntityStore() {
  const { entityStore } = useStores();
  return entityStore;
}