#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(EmailExtractionModule, NSObject)

RCT_EXTERN_METHOD(extractFromText:(NSString *)input
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(extractFromImage:(NSString *)fileUri
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(extractFromFile:(NSString *)fileUri
                  mimeType:(NSString *)mimeType
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(exportEmails:(NSArray *)emails
                  format:(NSString *)format
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end
