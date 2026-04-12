#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(EmailExtractionModule, NSObject)

RCT_EXTERN_METHOD(extractFromText:(NSString *)input
                  enabledTypes:(NSArray *)enabledTypes
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(extractFromImage:(NSString *)fileUri
                  enabledTypes:(NSArray *)enabledTypes
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(extractFromFile:(NSString *)fileUri
                  mimeType:(NSString *)mimeType
                  enabledTypes:(NSArray *)enabledTypes
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(exportExtractedItems:(NSString *)itemType
                  items:(NSArray *)items
                  format:(NSString *)format
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end
