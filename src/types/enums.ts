// Space Type Enums
export enum SpaceType {
  MEETING_ROOM = 0,
  HOT_DESK = 1,
  COWORKING_SPACE = 2,
  DEDICATED_DESK = 3
}

// Space Type String Mappings
export const SpaceTypeStrings: Record<SpaceType, string> = {
  [SpaceType.MEETING_ROOM]: 'meeting-room',
  [SpaceType.HOT_DESK]: 'hot-desk',
  [SpaceType.COWORKING_SPACE]: 'coworking-space',
  [SpaceType.DEDICATED_DESK]: 'dedicated-desk'
}

// Reverse mapping for string to enum
export const StringToSpaceType: Record<string, SpaceType> = {
  'meeting-room': SpaceType.MEETING_ROOM,
  'hot-desk': SpaceType.HOT_DESK,
  'coworking-space': SpaceType.COWORKING_SPACE,
  'dedicated-desk': SpaceType.DEDICATED_DESK
}

// Helper functions
export const getSpaceTypeString = (spaceType: SpaceType): string => {
  return SpaceTypeStrings[spaceType]
}

export const getSpaceTypeEnum = (spaceTypeString: string): SpaceType => {
  return StringToSpaceType[spaceTypeString] ?? SpaceType.MEETING_ROOM
}