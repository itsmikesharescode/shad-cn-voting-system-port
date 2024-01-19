

export type ServerNews<T> = {
    status: number
    type: string
    data: T
}

export type CreatedPositionTB = {
    id: number
    created_at: string
    position_name: string
    vote_limit: number
    share_code: string
}

export type CreatedCandidateTB = {
    id: number
    created_at: string
    position_name: string
    candidate_name: string
    candidate_organization: string
    candidate_agenda: string
    share_code: string
}