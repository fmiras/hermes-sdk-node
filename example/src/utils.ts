export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

export const PLUGGY_BANK_CONNECTOR = 2
export const PLUGGY_BANK_MFA_2STEP_CONNECTOR = 5

export const PLUGGY_BANK_CREDENTIALS = {
  user: 'user-ok',
  password: 'password-ok',
}
