<x-app-layout>
    <div class="flex justify-center flex-wrap">
        @foreach ($registros as $registro)
        <a href="registros?registro={{$registro->id}}" class="mx-5">
            <div id="{{$registro->id}}" class="bg-white p-8 rounded-lg shadow-lg w-full sm:w-96 mb-5">
                <h2 class="text-2xl font-semibold text-center mb-6 text-gray-800">Registro: {{$registro->id}}</h2>

                <!-- Card Content -->
                <div class="space-y-4">
                    <!-- Inicio de Ciclo -->
                    <div class="flex justify-between">
                        <span class="text-sm font-medium text-gray-700">Inicio de ciclo:</span>
                        <span class="text-sm text-gray-900">
                            <?php echo $registro->iniCiclo == 1 ? 'Si' : 'No'; ?>
                        </span>
                    </div>

                    <!-- Compostera -->
                    <div class="flex justify-between">
                        <span class="text-sm font-medium text-gray-700">Compostera:</span>
                        <span class="text-sm text-gray-900">
                            <?php
                            echo $composteras->find($registro->compostera)->nombre;
                            ?>
                        </span>
                    </div>

                    <!-- ID de Usuario -->
                    <div class="flex justify-between">
                        <span class="text-sm font-medium text-gray-700">Usuario:</span>
                        <span class="text-sm text-gray-900">
                            <?php
                            echo $usuarios->find($registro->user_id)->name;
                            ?>
                        </span>
                    </div>

                    <!-- Creación -->
                    <div class="flex justify-between">
                        <span class="text-sm font-medium text-gray-700">Creado:</span>
                        <span class="text-sm text-gray-900">{{$registro->created_at}}</span>
                    </div>
                </div>
            </div>
        </a>
        @endforeach
    </div>
</x-app-layout>