import "reflect-metadata";

export class MetadataManager {
  setMetadataForProperty(
    metaDataKey: string,
    metaDataValue: string,
    target: Object,
    propertyName: string
  ): void {
    Reflect.defineMetadata(metaDataKey, metaDataValue, target, propertyName);
  }

  getMetadataForProperty<T>(
    target: Object,
    propertyName: string,
    metaDataKey: string
  ): T | undefined {
    return Reflect.getMetadata(metaDataKey, target, propertyName);
  }
}
