package com.projeto2.nexo.external.exception;

import com.projeto2.nexo.exception.BaseException;
import org.springframework.http.HttpStatus;

public class IntegracaoQuestioneException extends BaseException {
    public IntegracaoQuestioneException(String mensagem, String... args) {
        super(mensagem, HttpStatus.BAD_REQUEST, args);
    }
}