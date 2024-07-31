import { GymsRepository } from '@/repositories/gymsRepository'

interface FetchNearbyGymsRequest {
  userLatitude: number
  userLongitude: number
}

export class FetchNearbyGymsUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({ userLatitude, userLongitude }: FetchNearbyGymsRequest) {
    const gymns = await this.gymsRepository.findManyNearby({
      latitude: userLatitude,
      longitude: userLongitude,
    })

    return { gymns }
  }
}
