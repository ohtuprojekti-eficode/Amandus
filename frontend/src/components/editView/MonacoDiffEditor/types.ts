export interface ChangeCommands {
  selectCurrentChanges: string
  selectIncomingChanges: string
  selectBothChanges: string
  cancel: string
}

export interface ConflictBlock {
  currentStart: number // row with <<<<<<
  middle: number // row with ======
  incomingEnd: number // row with >>>>>>
  handleStatus: HandleStatus
}

export type HandleStatus =
  | null
  | 'current-changes'
  | 'incoming-changes'
  | 'both-changes'
