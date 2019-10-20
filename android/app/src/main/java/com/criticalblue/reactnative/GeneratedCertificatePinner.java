package com.criticalblue.reactnative;

import okhttp3.CertificatePinner;

public class GeneratedCertificatePinner {
    public static CertificatePinner instance() {
        CertificatePinner.Builder builder = new CertificatePinner.Builder();

        builder.add("*.cp.co.id", "sha256/+pKUV9XFD8hIvHZkyZQCu1Mb0OUuDWhxMmtgEd50vK0=");
        builder.add("*.cp.co.id", "sha256/5kJvNEMw0KjrCAu7eXY5HZdvyCS13BbA0VJG1RSP91w=");

        return builder.build();
    }
}
