$(document).ready(function() {
    // ==================== MÁSCARAS E VALIDAÇÕES ====================
    $('#cpf').mask('000.000.000-00', {
        placeholder: "___.___.___-__",
        onComplete: function(cpf) {
            if (!validaCPF(cpf)) {
                showError(this, 'CPF inválido');
            } else {
                hideError(this);
            }
        }
    });

    // Máscara para telefone
    const SPMaskBehavior = function(val) {
        return val.replace(/\D/g, '').length === 11 ? '(00) 00000-0000' : '(00) 0000-00009';
    };
    
    const spOptions = {
        onKeyPress: function(val, e, field, options) {
            field.mask(SPMaskBehavior.apply({}, arguments), options);
        },
        placeholder: "(__) _____-____"
    };
    
    $('#telefones').mask(SPMaskBehavior, spOptions);

    // Máscara para CEP
    $('#cep').mask('00000-000', {
        placeholder: "_____-___"
    });

    // Funções de Validação
    function validaCPF(cpf) {
        cpf = cpf.replace(/[^\d]/g, '');
        if (cpf.length !== 11) return false;
        if (/^(\d)\1{10}$/.test(cpf)) return false;
        
        let soma = 0;
        for (let i = 0; i < 9; i++) {
            soma += parseInt(cpf.charAt(i)) * (10 - i);
        }
        let resto = 11 - (soma % 11);
        let dv1 = resto > 9 ? 0 : resto;
        
        soma = 0;
        for (let i = 0; i < 10; i++) {
            soma += parseInt(cpf.charAt(i)) * (11 - i);
        }
        resto = 11 - (soma % 11);
        let dv2 = resto > 9 ? 0 : resto;
        
        return dv1 === parseInt(cpf.charAt(9)) && dv2 === parseInt(cpf.charAt(10));
    }

    // Consulta CEP
    function consultaCEP(cep) {
        cep = cep.replace(/\D/g, '');
        if (cep.length !== 8) return false;

        $('#cidade, #estado').val('Carregando...').prop('disabled', true);

        $.getJSON(`https://viacep.com.br/ws/${cep}/json/`)
            .done(function(data) {
                if (!data.erro) {
                    $('#cidade').val(data.localidade);
                    $('#estado').val(data.uf);
                    hideError($('#cep'));
                } else {
                    $('#cidade, #estado').val('');
                    showError('#cep', 'CEP não encontrado');
                }
            })
            .fail(function() {
                $('#cidade, #estado').val('');
                showError('#cep', 'Erro ao consultar CEP');
            })
            .always(function() {
                $('#cidade, #estado').prop('disabled', false);
            });
    }

    // Funções de erro
    function showError(element, message) {
        const $element = $(element);
        $element.addClass('invalid');
        
        if (!$element.next('.error-message').length) {
            $('<div class="error-message"></div>')
                .text(message)
                .insertAfter($element);
        } else {
            $element.next('.error-message').text(message);
        }
    }

    function hideError(element) {
        const $element = $(element);
        $element.removeClass('invalid');
        $element.next('.error-message').remove();
    }

    // ==================== CONTROLE DE ETAPAS ====================
    const form = document.querySelector('form');
    const steps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.progress-step');
    let currentStep = 0;

    function showStep(stepIndex) {
        // Esconder todas as etapas e mostrar a atual
        $(steps).removeClass('active');
        $(steps[stepIndex]).addClass('active');

        // Atualizar progresso
        const progressWidth = ((stepIndex + 1) / steps.length) * 100;
        $('.progress-bar').css('--progress-width', `${progressWidth}%`);

        progressSteps.forEach((step, index) => {
            $(step).toggleClass('active', index === stepIndex)
                   .toggleClass('completed', index < stepIndex);
        });

        // Controlar botões
        $('.btn-prev').toggle(stepIndex !== 0);
        $('.btn-next').toggle(stepIndex !== steps.length - 1);
        $('.btn-submit').toggle(stepIndex === steps.length - 1);

        $('html, body').animate({ scrollTop: 0 }, 300);
    }

    function validateStep(stepIndex) {
        const $currentStep = $(steps[stepIndex]);
        let isValid = true;

        // Limpar erros anteriores
        $currentStep.find('.error-message').remove();
        $currentStep.find('.invalid').removeClass('invalid');

        // Validar campos obrigatórios
        $currentStep.find('[required]').each(function() {
            if (!$(this).val().trim()) {
                isValid = false;
                showError(this, 'Este campo é obrigatório');
            }
        });

        // Validações específicas da primeira etapa
        if (stepIndex === 0) {
            const cpf = $('#cpf').val();
            const telefone = $('#telefones').val().replace(/\D/g, '');
            const cep = $('#cep').val().replace(/\D/g, '');

            if (cpf && !validaCPF(cpf)) {
                isValid = false;
                showError('#cpf', 'CPF inválido');
            }

            if (telefone && telefone.length < 10) {
                isValid = false;
                showError('#telefones', 'Telefone inválido');
            }

            if (cep && cep.length !== 8) {
                isValid = false;
                showError('#cep', 'CEP inválido');
            }
        }

        if (!isValid) {
            const $firstError = $currentStep.find('.invalid').first();
            if ($firstError.length) {
                $('html, body').animate({
                    scrollTop: $firstError.offset().top - 100
                }, 500);
            }
        }

        return isValid;
    }

    // Event Listeners
    $('#cep').on('blur', function() {
        const cep = $(this).val().replace(/\D/g, '');
        if (cep.length === 8) {
            consultaCEP(cep);
        } else if (cep.length > 0) {
            showError(this, 'CEP inválido');
        }
    });

    $('.btn-prev').on('click', function() {
        if (currentStep > 0) {
            currentStep--;
            showStep(currentStep);
        }
    });

    $('.btn-next').on('click', function() {
        if (validateStep(currentStep)) {
            if (currentStep < steps.length - 1) {
                currentStep++;
                showStep(currentStep);
            }
        }
    });

    // Inicialização
    showStep(0);

    // Prevenir envio do formulário se houver erros
    $(form).on('submit', function(e) {
        if (!validateStep(currentStep)) {
            e.preventDefault();
        }
    });
});