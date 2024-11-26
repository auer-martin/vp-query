import * as v from 'valibot';
import { vJsonRecord, vNonEmptyArray } from './u-dcql.js';
import type { InferModelTypes } from './u-model';
import { Model } from './u-model.js';

export namespace DcqlMdocCredential {
  export const vNamespaces = v.record(
    v.string(),
    v.record(v.string(), v.unknown())
  );
  export const vModel = v.object({
    credential_format: v.literal('mso_mdoc'),
    doctype: v.string(),
    namespaces: vNamespaces,
  });

  export const model = new Model({ vModel });
  export type Model = InferModelTypes<typeof model>;
  export type NameSpaces = v.InferOutput<typeof vNamespaces>;
}
export type DcqlMdocCredential = DcqlMdocCredential.Model['Output'];

export namespace DcqlSdJwtVcCredential {
  export const vClaims = vJsonRecord;
  export const vModel = v.object({
    credential_format: v.literal('vc+sd-jwt'),
    vct: v.string(),
    claims: vClaims,
  });
  export const model = new Model({ vModel });
  export type Model = InferModelTypes<typeof model>;
  export type Claims = Model['Output']['claims'];
}
export type DcqlSdJwtVcCredential = DcqlSdJwtVcCredential.Model['Output'];

export namespace DcqlW3cVcCredential {
  export const vClaims = vJsonRecord;
  export const vModel = v.object({
    credential_format: v.picklist(['jwt_vc_json-ld', 'jwt_vc_json']),
    claims: vClaims,
  });

  export const model = new Model({ vModel });
  export type Model = InferModelTypes<typeof model>;
  export type Claims = Model['Output']['claims'];
}
export type DcqlW3cVcCredential = DcqlW3cVcCredential.Model['Output'];

export namespace DcqlCredential {
  export const vModel = v.variant('credential_format', [
    DcqlMdocCredential.vModel,
    DcqlSdJwtVcCredential.vModel,
    DcqlW3cVcCredential.vModel,
  ]);

  export const vParseSuccess = v.object({
    success: v.literal(true),
    typed: v.literal(true),
    issues: v.optional(v.undefined()),
    input_credential_index: v.number(),
    claim_set_index: v.union([v.number(), v.undefined()]),
    output: DcqlCredential.vModel,
  });

  export const vParseFailure = v.object({
    success: v.literal(false),
    typed: v.boolean(),
    output: v.unknown(),
    issues: v.pipe(v.array(v.unknown()), vNonEmptyArray()),
    input_credential_index: v.number(),
    claim_set_index: v.union([v.number(), v.undefined()]),
  });
  export const model = new Model({ vModel });
  export type Model = InferModelTypes<typeof model>;
}
export type DcqlCredential = DcqlCredential.Model['Output'];