﻿namespace SwiftServe.Dtos
{
    public class AuthResultDto
    {
        public bool Success { get; set; }
        public string Token { get; set; }
        public string ErrorMessage { get; set; }
        public string Message { get; set; }
    }
}
